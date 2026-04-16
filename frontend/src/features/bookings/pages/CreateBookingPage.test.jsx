import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CreateBookingPage from './CreateBookingPage';
import { bookingApi } from '../services/bookingApi';

vi.mock('../services/bookingApi', () => ({
  bookingApi: {
    create: vi.fn(),
  },
}));

describe('CreateBookingPage', () => {
  it('submits a booking request successfully', async () => {
    bookingApi.create.mockResolvedValueOnce({ id: '1' });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CreateBookingPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/resource id/i), 'LH-001');
    await user.selectOptions(screen.getByLabelText(/resource type/i), 'LECTURE_HALL');
    await user.type(screen.getByLabelText(/booking date/i), '2026-04-05');
    await user.type(screen.getByLabelText(/start time/i), '09:00');
    await user.type(screen.getByLabelText(/end time/i), '10:00');
    const attendeesInput = screen.getByLabelText(/expected attendees/i);
    await user.clear(attendeesInput);
    await user.type(attendeesInput, '50');
    await user.type(screen.getByLabelText(/purpose/i), 'Lecture session');
    await user.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => expect(bookingApi.create).toHaveBeenCalledTimes(1));
    expect(bookingApi.create).toHaveBeenCalledWith({
      resourceId: 'LH-001',
      resourceType: 'LECTURE_HALL',
      bookingDate: '2026-04-05',
      startTime: '09:00',
      endTime: '10:00',
      purpose: 'Lecture session',
      expectedAttendees: 50,
    });

    await waitFor(() => expect(screen.getByText(/booking created successfully/i)).toBeInTheDocument());
  });
});
