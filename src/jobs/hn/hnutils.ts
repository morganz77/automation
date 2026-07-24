import fetch from 'node-fetch';

interface Item {
  id: number;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  url?: string;
  score: number;
  title: string; //seems to be mandantory for non-comments
  time: number;
}

async function topNItems(n: number): Promise<Item[]> {
  const response = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  );
  const itemIds: number[] = await response.json();

  const itemPromises = itemIds.slice(0, n).map(async (id) => {
    try {
      const item = await (
        await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      ).json();
      console.log(item);
      return item as Item;
    } catch {
      console.error(`error: ${id}`);
      return undefined;
    }
  });

  return (await Promise.all(itemPromises)).filter((ret): ret is Item => !!ret);
}

function generateNotes(items: Item[]): string {
  return items
    .map((item) => {
      const hnLink = `https://news.ycombinator.com/item?id=${item.id}`;
      const base = `${item.title}\n${item.score} points ${Math.trunc(
        (+new Date() / 1000 - item.time) / 3600
      )} hours ago\n${hnLink}`;

      return item.url ? `${base}\n${item.url}` : `${base}`;
    })
    .join('\n\n');
}

export { Item, topNItems, generateNotes };
