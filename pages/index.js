import { useState } from 'react';
import Head from 'next/head';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Home() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i) {
    if (squares[i] || winner) return;

    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';

    const result = calculateWinner(next);
    if (result) {
      setScore((s) => ({ ...s, [result.player]: s[result.player] + 1 }));
    } else if (next.every(Boolean)) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }

    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function resetBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetAll() {
    resetBoard();
    setScore({ X: 0, O: 0, draws: 0 });
  }

  let status;
  if (winner) status = `Winner: ${winner.player} 🎉`;
  else if (isDraw) status = "It's a draw! 🤝";
  else status = `Turn: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <Head>
        <title>Tic Tac Toe</title>
        <meta name="description" content="A Tic Tac Toe game built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        <h1 className="title">Tic Tac Toe</h1>

        <div className="scoreboard">
          <div className="score score-x">
            <span>Player X</span>
            <strong>{score.X}</strong>
          </div>
          <div className="score score-draw">
            <span>Draws</span>
            <strong>{score.draws}</strong>
          </div>
          <div className="score score-o">
            <span>Player O</span>
            <strong>{score.O}</strong>
          </div>
        </div>

        <p className={`status ${winner ? 'status-win' : ''}`}>{status}</p>

        <div className="board">
          {squares.map((value, i) => {
            const isWinning = winner?.line.includes(i);
            return (
              <button
                key={i}
                className={`cell ${value ? `cell-${value.toLowerCase()}` : ''} ${
                  isWinning ? 'cell-win' : ''
                }`}
                onClick={() => handleClick(i)}
                aria-label={`Cell ${i + 1}${value ? `, ${value}` : ', empty'}`}
              >
                {value}
              </button>
            );
          })}
        </div>

        <div className="controls">
          <button className="btn btn-primary" onClick={resetBoard}>
            New Round
          </button>
          <button className="btn" onClick={resetAll}>
            Reset Scores
          </button>
        </div>

        <footer className="footer">Built with Next.js &amp; React</footer>
      </main>
    </>
  );
}
