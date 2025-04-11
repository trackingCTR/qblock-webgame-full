import React from 'react';  # обновил файл
import ReactDOM from 'react-dom/client';
import './index.css';
import QblockGame from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QblockGame />
  </React.StrictMode>
);
