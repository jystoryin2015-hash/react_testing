import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders heading and main layout', () => {
    render(<App />);
    expect(screen.getByText('React Testing Sandbox')).toBeInTheDocument();
    expect(screen.getByText('Counter')).toBeInTheDocument();
  });

  it('increments and decrements counter', async () => {
    const user = userEvent.setup();
    render(<App />);

    const counterValue = screen.getByTestId('counter-value');
    expect(counterValue).toHaveTextContent('0');

    const incrementBtn = screen.getByRole('button', { name: 'increment' });
    const decrementBtn = screen.getByRole('button', { name: 'decrement' });

    await user.click(incrementBtn);
    expect(counterValue).toHaveTextContent('1');

    await user.click(decrementBtn);
    expect(counterValue).toHaveTextContent('0');
  });

  it('updates typed text dynamically', async () => {
    const user = userEvent.setup();
    render(<App />);

    const inputElement = screen.getByPlaceholderText('Type something here...');
    expect(screen.queryByTestId('typed-text')).not.toBeInTheDocument();

    await user.type(inputElement, 'Hello, Vitest!');
    expect(screen.getByTestId('typed-text')).toHaveTextContent('Hello, Vitest!');
  });
});
