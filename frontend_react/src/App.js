import React, { useState, useEffect } from "react";
import "./App.css";

/*
  COLORS (from project description):
    --accent: #FBC02D
    --primary: #1976D2
    --secondary: #424242
    --theme: light
*/

/** Square component for board cell */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? value : "empty square"}
      tabIndex={0}
    >
      {value && (
        <span className={`ttt-symbol ttt-symbol-${value}`}>
          {value}
        </span>
      )}
    </button>
  );
}

/** PUBLIC_INTERFACE
 * Renders the Tic Tac Toe 3x3 game board.
 */
function Board({ squares, onSquareClick, winningLine, finished }) {
  // Renders the nine squares of the game board in 3 rows
  const renderSquare = i => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      highlight={winningLine && winningLine.includes(i)}
    />
  );
  const rows = [];
  for (let row = 0; row < 3; row++) {
    rows.push(
      <div className="ttt-board-row" key={row}>
        {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
      </div>
    );
  }
  return (
    <div
      className={`ttt-board${finished ? " board-finished" : ""}`}
      aria-label="Tic Tac Toe board"
      role="grid"
    >
      {rows}
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Returns winner symbol ("X" or "O") and the line, or null if none.
 */
function calculateWinner(squares) {
  // All rows, columns, diagonals
  const lines = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8], // rows
    [0, 3, 6],[1, 4, 7],[2, 5, 8], // cols
    [0, 4, 8],[2, 4, 6],           // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/** PUBLIC_INTERFACE
 * TicTacToe game logic and UI
 */
function TicTacToe() {
  // Game state
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const current = history[step];
  const winnerData = calculateWinner(current);
  const finished = winnerData || current.every(Boolean);

  // For subtle pop animation after move
  const [animateBoard, setAnimateBoard] = useState(false);

  useEffect(() => {
    if (step > 0) {
      setAnimateBoard(true);
      const t = setTimeout(() => setAnimateBoard(false), 150);
      return () => clearTimeout(t);
    }
  }, [step]);

  // PUBLIC_INTERFACE
  /** Handles click on a square */
  function handleSquareClick(idx) {
    if (finished || current[idx]) return;
    const nextSquares = current.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setHistory([...history.slice(0, step + 1), nextSquares]);
    setStep(step + 1);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  /** Resets the game */
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  }

  // UI messages
  let status, accentStatus = false;
  if (winnerData) {
    status = `Player ${winnerData.winner} wins! 🎉`;
    accentStatus = true;
  } else if (current.every(Boolean)) {
    status = "It's a tie!";
    accentStatus = true;
  } else {
    status = `Next turn: Player ${xIsNext ? "X" : "O"}`;
    accentStatus = false;
  }

  return (
    <div className="ttt-game-container">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div
        className={
          "ttt-status" +
          (accentStatus ? " ttt-status-accent" : "") +
          (animateBoard ? " fade-in" : "")
        }
        aria-live="polite"
      >
        {status}
      </div>
      <Board
        squares={current}
        onSquareClick={handleSquareClick}
        winningLine={winnerData ? winnerData.line : null}
        finished={!!winnerData || current.every(Boolean)}
      />
      <button
        className="ttt-reset-btn"
        onClick={handleReset}
        aria-label="New Game"
      >
        {step === 0 ? "Start" : "New Game"}
      </button>
      <footer className="ttt-footer">
        <span className="footer-credit">
          A modern minimal game &middot; <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Remove theme toggle and default template, insert TTT UI
  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <TicTacToe />
    </div>
  );
}

export default App;
