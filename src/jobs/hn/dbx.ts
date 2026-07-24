import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import { getHnJobConfig } from '../../config';
import { Item } from './hnutils';

const CACHE_FILE = '/hn-job.json';

function client(): Dropbox {
  return new Dropbox({
    accessToken: getHnJobConfig().dropboxAccessToken,
    fetch: fetch,
  });
}

async function read(): Promise<number[]> {
  try {
    const db = await client().filesDownload({ path: CACHE_FILE });
    const buffer: Buffer = (db.result as any).fileBinary;
    const records: number[] = JSON.parse(buffer.toString('utf8'));
    return records;
  } catch (e) {
    console.error(JSON.stringify(e));
    return [];
  }
}

async function write(itemIds: number[]): Promise<void> {
  await client().filesUpload({
    path: CACHE_FILE,
    contents: JSON.stringify(itemIds),
    mode: { '.tag': 'overwrite' },
  });
}

async function filterExisting(items: Item[]): Promise<Item[]> {
  const existing = await read();
  return items.filter((item) => !existing.includes(item.id));
}

async function addToExisting(itemIds: number[]): Promise<void> {
  const existing = await read();
  await write([...existing, ...itemIds]);
}

export { filterExisting, addToExisting };
