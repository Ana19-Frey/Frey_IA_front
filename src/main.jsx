// frey-frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ⚠️ LIGNE CRITIQUE : Importation des styles CSS de Bootstrap
// Ceci permet à l'application d'utiliser toutes les classes Bootstrap (responsive, design, etc.)
import 'bootstrap/dist/css/bootstrap.min.css'; 

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);