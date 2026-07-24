const mockFilesDownload = jest.fn();
const mockFilesUpload = jest.fn();

jest.mock('dropbox', () => ({
  Dropbox: jest.fn().mockImplementation(() => ({
    filesDownload: mockFilesDownload,
    filesUpload: mockFilesUpload,
  })),
}));

import { addToExisting, filterExisting } from './dbx';
import { Item } from './hnutils';

const item = (id: number): Item => ({
  id,
  type: 'story',
  score: 100,
  title: `title ${id}`,
  time: 0,
});

const cache = (ids: number[]) => ({
  result: { fileBinary: Buffer.from(JSON.stringify(ids)) },
});

describe('dropbox cache', () => {
  beforeEach(() => {
    process.env.DropboxAppKey = 'app-key';
    process.env.DropboxAppSecret = 'app-secret';
    process.env.DropboxRefreshToken = 'refresh-token';
    mockFilesDownload.mockReset();
    mockFilesUpload.mockReset();
  });

  it('filterExisting drops items already in the cache', async () => {
    mockFilesDownload.mockResolvedValue(cache([1, 2]));

    const res = await filterExisting([item(1), item(3)]);

    expect(res.map((i) => i.id)).toEqual([3]);
  });

  it('addToExisting appends the new ids to the cache', async () => {
    mockFilesDownload.mockResolvedValue(cache([1]));
    mockFilesUpload.mockResolvedValue({});

    await addToExisting([2, 3]);

    expect(mockFilesUpload).toHaveBeenCalledWith(
      expect.objectContaining({ contents: JSON.stringify([1, 2, 3]) }),
    );
  });

  it('treats a download failure as an empty cache', async () => {
    mockFilesDownload.mockRejectedValue(new Error('not found'));

    const res = await filterExisting([item(1)]);

    expect(res.map((i) => i.id)).toEqual([1]);
  });
});
