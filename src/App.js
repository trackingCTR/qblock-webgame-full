// Web version of the Qblock-inspired puzzle game
// Core technologies: React + TailwindCSS + HTML5 drag-n-drop

import React, { useState } from "react";

const initialPieces = [
  { id: 1, shape: [[1, 1], [1, 1]], color: "bg-blue-300" },
  { id: 2, shape: [[1, 1, 1], [0, 1, 0]], color: "bg-orange-300" }, // cross
  { id: 3, shape: [[1, 0], [1, 1]], color: "bg-green-300" },
];

const createGrid = (rows = 10, cols = 10) => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

export default function QblockGame() {
  const [grid, setGrid] = useState(createGrid());
  const [pieces, setPieces] = useState(initialPieces);
  const [score, setScore] = useState(640);
  const [moves, setMoves] = useState(8);
  const [draggedPiece, setDraggedPiece] = useState(null);

  const clearLines = (grid) => {
    const size = grid.length;
    const rowsToClear = [];
    const colsToClear = [];

    for (let i = 0; i < size; i++) {
      if (grid[i].every(cell => cell === 1)) rowsToClear.push(i);
      if (grid.every(row => row[i] === 1)) colsToClear.push(i);
    }

    const newGrid = grid.map(row => [...row]);
    rowsToClear.forEach(row => {
      for (let i = 0; i < size; i++) newGrid[row][i] = 0;
    });
    colsToClear.forEach(col => {
      for (let i = 0; i < size; i++) newGrid[i][col] = 0;
    });

    const cleared = rowsToClear.length + colsToClear.length;
    return { newGrid, cleared };
  };

  const handleDrop = (row, col) => {
    if (!draggedPiece) return;
    const newGrid = [...grid.map(r => [...r])];
    const shape = draggedPiece.shape;

    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;

    if (row + shapeHeight > 10 || col + shapeWidth > 10) return;

    const canPlace = shape.every((shapeRow, rIdx) =>
      shapeRow.every((cell, cIdx) => {
        if (cell === 0) return true;
        const newRow = row + rIdx;
        const newCol = col + cIdx;
        return (
          newRow < 10 && newCol < 10 && newGrid[newRow][newCol] === 0
        );
      })
    );

    if (canPlace) {
      shape.forEach((shapeRow, rIdx) => {
        shapeRow.forEach((cell, cIdx) => {
          if (cell === 1) {
            newGrid[row + rIdx][col + cIdx] = 1;
          }
        });
      });
      const { newGrid: clearedGrid, cleared } = clearLines(newGrid);
      setGrid(clearedGrid);
      setScore(score + cleared * 100);
      setDraggedPiece(null);
      setMoves((m) => m - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#f6f1ea] p-10 font-sans">
      {/* Settings Panel */}
      <div className="mr-10 w-64 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Settings</h2>
        <div className="mb-4">
          <label className="block font-semibold">Difficulty</label>
          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="difficulty" defaultChecked /> <span>Easy</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="difficulty" /> <span>Medium</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="difficulty" /> <span>Hard</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Toggle label="Sound" defaultChecked />
          <Toggle label="Dark Theme" />
          <Toggle label="Special Pieces" defaultChecked />
        </div>
        <button className="mt-6 w-full rounded-xl bg-[#f6f1ea] py-2 font-semibold shadow">New Game</button>
      </div>

      {/* Game Area */}
      <div>
        <div className="mb-4 flex justify-between px-2 text-lg font-semibold">
          <span>Score {score}</span>
          <span>Moves {moves}</span>
        </div>
        <div className="grid grid-cols-10 gap-1 rounded-2xl bg-white p-2 shadow-inner">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                className={`aspect-square w-8 h-8 rounded-lg border border-neutral-200 ${cell ? "bg-gray-400" : "bg-neutral-100"}`}
              ></div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-center space-x-6">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              draggable
              onDragStart={() => setDraggedPiece(piece)}
              className="flex flex-col items-center justify-center p-1 cursor-move bg-transparent"
            >
              {piece.shape.map((row, rowIdx) => (
                <div key={rowIdx} className="flex">
                  {row.map((cell, colIdx) => (
                    <div
                      key={colIdx}
                      className={`w-8 h-8 m-0.5 rounded-md ${
                        cell ? piece.color : "bg-transparent"
                      }`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  return (
    <label className="flex items-center justify-between">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="form-checkbox accent-blue-400" />
    </label>
  );
}
