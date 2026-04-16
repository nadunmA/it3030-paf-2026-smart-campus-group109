import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { RequireAuth, RequireRole } from './RouteGuards';

function Protected({ children }) {
  return children;
}

describe('RouteGuards', () => {
  it('redirects unauthenticated users away from protected routes', () => {
    render(
      <MemoryRouter initialEntries={['/bookings/create']}>
        <Routes>
          <Route
            path="/bookings/create"
            element={
              <RequireAuth>
                <Protected>Protected</Protected>
              </RequireAuth>
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('redirects non-admin users away from admin route', () => {
    sessionStorage.setItem('token', 'token-1');
    sessionStorage.setItem('user', JSON.stringify({ role: 'USER' }));

    render(
      <MemoryRouter initialEntries={['/bookings/admin']}>
        <Routes>
          <Route
            path="/bookings/admin"
            element={
              <RequireRole allowedRoles={["ADMIN"]}>
                <Protected>Admin</Protected>
              </RequireRole>
            }
          />
          <Route path="/bookings/me" element={<div>My Bookings</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('My Bookings')).toBeInTheDocument();
  });
});
