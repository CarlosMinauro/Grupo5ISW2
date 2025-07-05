import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dashboard from '../../pages/Dashboard';

const mockStore = configureStore([thunk]);

describe('Dashboard Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        isAuthenticated: true
      },
      categories: {
        categories: [
          { id: 1, name: 'Food' },
          { id: 2, name: 'Transport' }
        ],
        loading: false,
        error: null
      }
    });

    // Mock fetch for expenses and budgets
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ expenses: [], budgets: [] })
      })
    ) as jest.Mock;
  });

  it('renders dashboard with user information', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('displays categories from Redux store', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transport')).toBeInTheDocument();
    });
  });

  it('shows loading state when fetching data', () => {
    store = mockStore({
      auth: {
        user: { id: 1, name: 'Test User' },
        isAuthenticated: true
      },
      categories: {
        categories: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
}); 