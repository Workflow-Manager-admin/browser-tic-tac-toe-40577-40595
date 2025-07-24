import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
test('renders Tic Tac Toe title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Tic Tac Toe/i);
  expect(titleElement).toBeInTheDocument();
});

test('all squares are empty on new game', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button', { name: /empty square/i });
  expect(buttons.length).toBe(9);
  buttons.forEach(btn => expect(btn.textContent).toBe(""));
});

test('can play X and O and detect win', () => {
  render(<App />);
  const getSquares = () =>
    screen.getAllByRole('button', { name: /empty square|X|O/i });
  const squares = getSquares();
  // X in 0
  fireEvent.click(squares[0]);
  // O in 3
  fireEvent.click(squares[3]);
  // X in 1
  fireEvent.click(squares[1]);
  // O in 4
  fireEvent.click(squares[4]);
  // X in 2 (win)
  fireEvent.click(squares[2]);
  expect(screen.getByText(/Player X wins/i)).toBeInTheDocument();
});
