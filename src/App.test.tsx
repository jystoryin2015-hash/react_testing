import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('Foodie Translate App', () => {
  it('renders heading and main sections', () => {
    render(<App />);
    expect(screen.getByText('Foodie Translate')).toBeInTheDocument();
    expect(screen.getByText(/Upload Food Photo/i)).toBeInTheDocument();
    expect(screen.getByText(/Describe the Food/i)).toBeInTheDocument();
  });

  it('updates description text input', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const textarea = screen.getByPlaceholderText(/e.g., This delicious pasta/i);
    await user.type(textarea, 'Yummy pizza!');
    
    expect(textarea).toHaveValue('Yummy pizza!');
  });

  it('simulates the translation process with loading and result', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByPlaceholderText(/e.g., This delicious pasta/i);
    const translateBtn = screen.getByRole('button', { name: /Translate Now/i });
    const langSelect = screen.getByRole('combobox');

    // 1. Set description and target language
    await user.type(textarea, 'Delicious pasta');
    await user.selectOptions(langSelect, 'ja'); // Select Japanese

    // 2. Click translate
    await user.click(translateBtn);

    // 3. Check loading state
    expect(screen.getByText(/Translating.../i)).toBeInTheDocument();
    expect(translateBtn).toBeDisabled();

    // 4. Wait for result
    await waitFor(() => {
      expect(screen.getByText(/\[Japanese Translation\] Delicious pasta/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // 5. Result should be displayed and button should be enabled again
    expect(translateBtn).not.toBeDisabled();
  });
});
