import PushBullet = require('pushbullet');
import { getHnJobConfig } from '../../config';
import * as dbx from './dbx';
import { generateNotes, topNItems } from './hnutils';

/**
 * Fetch the current top Hacker News stories, drop anything already seen
 * (tracked in a Dropbox-backed cache), and push a digest of the best new
 * ones through Pushbullet.
 */
export async function runHnJob(): Promise<void> {
  const { pushBulletApiKey, pushBulletDeviceId } = getHnJobConfig();

  const items = await topNItems(100);
  const sorted = items
    .filter((i) => i.score > 80)
    .sort((i1, i2) => i2.score - i1.score);
  const filtered = await dbx.filterExisting(sorted);
  const final = filtered.slice(0, 15);

  const notes = generateNotes(final);

  const pb = new PushBullet(pushBulletApiKey);
  pb.note(pushBulletDeviceId, 'hn', notes);

  await dbx.addToExisting(final.map((item) => item.id));
}
