import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../Settings';

beforeAll(() => {
  global.fetch = jest.fn();
  localStorage.setItem('token', 'testtoken');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Settings Component 🛠️', () => {

  it('renders profile tab by default', () => {
    render(<Settings />);
    expect(screen.getByLabelText('Kullanıcı Adı')).toBeInTheDocument();
  });

  it('updates username successfully 📝', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Başarıyla güncellendi' }),
    });

    render(<Settings />);

    fireEvent.change(screen.getByLabelText('Kullanıcı Adı'), { target: { value: 'newUser' } });
    fireEvent.click(screen.getByRole('button', { name: 'GÜNCELLE' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      '/api/updateProfile',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer testtoken' }),
        body: JSON.stringify({ username: 'newUser' }),
      })
    ));

    expect(await screen.findByText('Profil güncellendi ✅')).toBeInTheDocument();
  });

  it('shows error when profile update fails ❌', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Hata oluştu' }),
    });

    render(<Settings />);

    fireEvent.click(screen.getByRole('button', { name: 'GÜNCELLE' }));

    expect(await screen.findByText('Hata oluştu')).toBeInTheDocument();
  });

  it('changes password successfully 🔐', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Şifre başarıyla değiştirildi' }),
    });

    render(<Settings />);

    fireEvent.click(screen.getByRole('tab', { name: 'ŞİFRE DEĞİŞTİR' }));

    fireEvent.change(screen.getByLabelText('Mevcut Şifre'), { target: { value: 'oldPass' } });
    fireEvent.change(screen.getByLabelText('Yeni Şifre'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Yeni Şifre Tekrar'), { target: { value: 'newPass123' } });

    fireEvent.click(screen.getByRole('button', { name: 'ŞİFRE DEĞİŞTİR' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      '/api/changePassword',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer testtoken' }),
        body: JSON.stringify({ currentPassword: 'oldPass', newPassword: 'newPass123' }),
      })
    ));

    expect(await screen.findByText('Şifre başarıyla değiştirildi ✅')).toBeInTheDocument();
  });

  it('shows mismatch error if passwords do not match 🚫', async () => {
    render(<Settings />);

    fireEvent.click(screen.getByRole('tab', { name: 'ŞİFRE DEĞİŞTİR' }));

    fireEvent.change(screen.getByLabelText('Yeni Şifre'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Yeni Şifre Tekrar'), { target: { value: 'differentPass' } });

    fireEvent.click(screen.getByRole('button', { name: 'ŞİFRE DEĞİŞTİR' }));

    expect(await screen.findByText('Yeni şifreler eşleşmiyor')).toBeInTheDocument();
  });

});