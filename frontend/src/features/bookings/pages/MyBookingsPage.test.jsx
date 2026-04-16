import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MyBookingsPage from './MyBookingsPage';
import { bookingApi } from '../services/bookingApi';

vi.mock('../services/bookingApi', () => ({
  bookingApi: {
    getMine: vi.fn(),
    cancel: vi.fn(),
  },
}));

describe('MyBookingsPage', () => {
  it('cancels an owned booking after confirmation', async () => {
    bookingApi.getMine.mockResolvedValueOnce([
      {
        id: 'bk-1',
        resourceId: 'MR-001',
        bookingDate: '2026-04-10',
        startTime: '11:00',
        endTime: '12:00',
        purpose: 'Team sync',
        expectedAttendees: 8,
        status: 'APPROVED',
        userId: 'user-1',
      },
    ]);
    bookingApi.cancel.mockResolvedValueOnce({ id: 'bk-1' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MyBookingsPage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('MR-001')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => expect(bookingApi.cancel).toHaveBeenCalledWith('bk-1'));
    await waitFor(() => expect(screen.getByText(/booking cancelled successfully/i)).toBeInTheDocument());
  });
});
