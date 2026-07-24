jest.mock('node-fetch', () => jest.fn());

import fetch, {
  RequestInfo,
  RequestInit,
  Response as NodeResPonse,
} from 'node-fetch';
import { generateNotes, Item, topNItems } from './hnutils';

const { Response } = jest.requireActual('node-fetch');

describe('hacker news utils', () => {
  it('generate top n item ids correctly', async () => {
    const fakeIds = Array.from(Array(100).keys());
    const fakeItem = {
      'by': 'kmcquade',
      'descendants': 76,
      'id': 26154038,
      'score': 307,
      'time': 1613485014,
      'title':
        'Show HN: Endgame – An AWS Pentesting tool to backdoor or expose AWS resources',
      'type': 'story',
      'url': 'https://github.com/salesforce/endgame',
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      (
        url: RequestInfo,
        init?: RequestInit | undefined
      ): Promise<NodeResPonse> => {
        if (typeof url === 'string') {
          if (url.includes('v0/topstories')) {
            return Promise.resolve(new Response(JSON.stringify(fakeIds)));
          }
          if (url.includes('v0/item/')) {
            return Promise.resolve(new Response(JSON.stringify(fakeItem)));
          }
        }
        return Promise.resolve(new Response(''));
      }
    );

    const ids = await topNItems(2);
    expect(ids.length).toBe(2);
  });

  it('generate notes to be sent correctly', () => {
    const items: Item[] = [
      {
        id: 1,
        type: 'story',
        url: 'http://dummy1.com',
        score: 80,
        title: 'title 1',
        time: Date.now() / 1000 - 3600, // 1 hour ago
      },
      {
        id: 2,
        type: 'story',
        url: 'http://dummy2.com',
        score: 90,
        title: 'title 2',
        time: Date.now() / 1000 - 3600 * 2, // 2 hours ago
      },
    ];
    const notes = generateNotes(items);
    const expectedNotes = `title 1
80 points 1 hours ago
https://news.ycombinator.com/item?id=1
http://dummy1.com

title 2
90 points 2 hours ago
https://news.ycombinator.com/item?id=2
http://dummy2.com`;
    expect(notes).toBe(expectedNotes);
  });
});
