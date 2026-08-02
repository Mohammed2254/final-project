import { describe, it, expect, vi, afterEach } from 'vitest';

import { uploadImageToCloudinary } from '@/services/cloudinary/upload';

const file = new File(['fake-image-bytes'], 'photo.jpg', { type: 'image/jpeg' });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('uploadImageToCloudinary', () => {
  it('returns the secure_url from a successful upload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ secure_url: 'https://res.cloudinary.com/demo/image/upload/photo.jpg' }),
      }),
    );

    const url = await uploadImageToCloudinary(file);

    expect(url).toBe('https://res.cloudinary.com/demo/image/upload/photo.jpg');
  });

  it('sends the file and the unsigned preset as form data, not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: 'https://res.cloudinary.com/demo/image/upload/photo.jpg' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await uploadImageToCloudinary(file);

    const [, options] = fetchMock.mock.calls[0];
    expect(options.body).toBeInstanceOf(FormData);
    expect(options.body.get('file')).toBe(file);
    expect(options.body.has('upload_preset')).toBe(true);
  });

  it('throws when Cloudinary responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(uploadImageToCloudinary(file)).rejects.toThrow();
  });
});
