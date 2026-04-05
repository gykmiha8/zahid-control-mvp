import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock window.confirm to prevent blocking tests with confirmation dialogs
const mockConfirm = vi.fn();
beforeAll(() => {
  global.confirm = mockConfirm;
});
afterAll(() => {
  global.confirm = undefined;
});

describe('App Component', () => {
  // Test 1: Basic rendering and default tab content
  it('renders the App component and displays the Task Board by default', () => {
    render(<App />);
    expect(screen.getByText(/ZahidControl/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Task Board/i })).toHaveClass('bg-white'); // Active tab
    expect(screen.getByRole('heading', { name: /Add Manual Task/i })).toBeInTheDocument();
    expect(screen.getAllByText(/To Do/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/In Progress/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Done/i).length).toBeGreaterThan(0);
  });

  // Test 2: Tab switching functionality
  it('allows switching between tabs', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Tickets & Entrance/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Entrance Gate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tickets & Entrance/i })).toHaveClass('bg-white');
    });

    fireEvent.click(screen.getByRole('button', { name: /Crowd Control/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Areas Overview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Crowd Control/i })).toHaveClass('bg-white');
    });

    fireEvent.click(screen.getByRole('button', { name: /Task Board/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Add Manual Task/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Task Board/i })).toHaveClass('bg-white');
    });
  });

  // Test 3: Task Board - Add a manual task
  it('allows adding a manual task', async () => {
    render(<App />);
    const taskTitleInput = screen.getByPlaceholderText(/Task Title.../i);
    const addTaskButton = screen.getByRole('button', { name: /Add Task/i });
    const todoColumn = screen.getByRole('heading', { name: /todo/i }).closest('.flex-col');

    fireEvent.change(taskTitleInput, { target: { value: 'Test New Task' } });
    fireEvent.click(addTaskButton);

    await waitFor(() => {
      expect(screen.getByText('Test New Task')).toBeInTheDocument();
      expect(taskTitleInput).toHaveValue('');
    });
  });

  // Test 4: Ticket Control - Add a random ticket
  it('allows generating a random ticket', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Tickets & Entrance/i }));

    const generateRandomButton = screen.getByRole('button', { name: /Generate Random/i });
    fireEvent.click(generateRandomButton);

    await waitFor(() => {
      const ticketRows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
      expect(ticketRows.length).toBeGreaterThan(0); // At least one ticket should be there
      expect(screen.getAllByText(/valid/i).length).toBeGreaterThan(0); // Check for 'valid' status
    });
  });

  // Test 5: Crowd Control - Add a new area
  it('allows adding a new area', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Crowd Control/i }));

    const areaNameInput = screen.getByPlaceholderText(/e.g. VIP Lounge/i);
    const capacityInput = screen.getByPlaceholderText(/e.g. 50/i);
    const deployAreaButton = screen.getByRole('button', { name: /Deploy Area/i });

    fireEvent.change(areaNameInput, { target: { value: 'Stage Area' } });
    fireEvent.change(capacityInput, { target: { value: '100' } });
    fireEvent.click(deployAreaButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Stage Area/i })).toBeInTheDocument();
      expect(screen.getByText(/100/i)).toBeInTheDocument(); // Capacity limit
      expect(areaNameInput).toHaveValue('');
      expect(capacityInput).toHaveValue(null); // Number input clears to null
    });
  });

  // Test 6: Crowd Control - Auto-task generation for exceeded capacity
  it('generates auto-tasks when an area exceeds capacity', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Tickets & Entrance/i }));

    const enterCodeInput = screen.getByPlaceholderText(/Scan Ticket Code/i);
    const enterFestivalButton = screen.getByRole('button', { name: /Enter Festival/i });

    for (let i = 0; i < 11; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Generate Random/i }));
    }

    const activateButtons = await screen.findAllByRole('button', { name: /Activate/i });
    for (let i = 0; i < 11; i++) {
      fireEvent.click(activateButtons[i]);
    }

    fireEvent.click(screen.getByRole('button', { name: /Task Board/i }));

    await waitFor(() => {
      expect(screen.getByText(/CRITICAL: Total festival limit exceeded!/i)).toBeInTheDocument();
      expect(screen.getByText(/ALERT: Too many people in Entrance/i)).toBeInTheDocument();
    });
  });

  // Test 7: Intentionally failing test to demonstrate test failure reporting
  it('should intentionally fail to demonstrate test failure reporting', () => {
    render(<App />);
    expect(screen.queryByText(/ZahidControl/i)).not.toBeInTheDocument();
  });
});
