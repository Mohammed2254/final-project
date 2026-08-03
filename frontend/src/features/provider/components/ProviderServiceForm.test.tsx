import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProviderServiceForm } from '@/features/provider/components/ProviderServiceForm';

vi.mock('@/features/provider/hooks/useServiceCategories', () => ({
  useServiceCategories: () => ({
    categories: [{ category_id: 1, category_name: 'قاعات' }],
    isLoading: false,
  }),
}));

vi.mock('@/services/cloudinary/upload', () => ({
  uploadImageToCloudinary: vi.fn(),
}));

import { uploadImageToCloudinary } from '@/services/cloudinary/upload';

describe('ProviderServiceForm image upload', () => {
  beforeEach(() => {
    vi.mocked(uploadImageToCloudinary).mockReset();
  });

  it('shows an upload button, not a URL field, for adding an image', () => {
    render(<ProviderServiceForm isLoading={false} onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: /رفع صورة/ })).toBeInTheDocument();
    expect(screen.queryByLabelText(/رابط الصورة/)).not.toBeInTheDocument();
  });

  it('uploads the chosen file to Cloudinary and previews the returned URL', async () => {
    vi.mocked(uploadImageToCloudinary).mockResolvedValue('https://res.cloudinary.com/demo/image.jpg');
    const user = userEvent.setup();

    render(<ProviderServiceForm isLoading={false} onSubmit={vi.fn()} />);

    const file = new File(['fake'], 'hall.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(uploadImageToCloudinary).toHaveBeenCalledWith(file);
    });

    await waitFor(() => {
      expect(screen.getByAltText('صورة الخدمة 1')).toHaveAttribute(
        'src',
        'https://res.cloudinary.com/demo/image.jpg',
      );
    });
  });
});
