import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminBookingApprovalPage from './AdminBookingApprovalPage';
import { bookingApi } from '../services/bookingApi';

vi.mock('../services/bookingApi', () => ({
  bookingApi: {
    getAll: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  },
}));

describe('AdminBookingApprovalPage', () => {
  beforeEach(() => {
    sessionStorage.setItem('token', 'token-1');
    sessionStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
  });

  it('approves and rejects pending bookings', async () => {
    bookingApi.getAll.mockResolvedValue([
      {
        id: 'bk-2',
        resourceId: 'LAB-001',
        bookingDate: '2026-04-12',
        startTime: '13:00',
        endTime: '14:00',
        purpose: 'Practical',
        expectedAttendees: 24,
        status: 'PENDING',
        userId: 'user-2',
      },
    ]);
    bookingApi.approve.mockResolvedValueOnce({ id: 'bk-2' });
    bookingApi.reject.mockResolvedValueOnce({ id: 'bk-2' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'prompt').mockReturnValue('Not enough capacity');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminBookingApprovalPage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('LAB-001')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /approve/i }));
    await waitFor(() => expect(bookingApi.approve).toHaveBeenCalledWith('bk-2'));
    await waitFor(() => expect(screen.getByText(/booking approved successfully/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /reject/i }));
    await waitFor(() => expect(bookingApi.reject).toHaveBeenCalledWith('bk-2', 'Not enough capacity'));
    await waitFor(() => expect(screen.getByText(/booking rejected successfully/i)).toBeInTheDocument());
  });
});
