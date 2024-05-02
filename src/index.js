import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
import "@fontsource/montserrat/600.css"; // Specify weight
import "@fontsource/montserrat/600-italic.css"; // Specify weight and style
import "@fontsource/montserrat/700.css"; // Specify weight
import "@fontsource/montserrat/700-italic.css"; // Specify weight and style
import "@fontsource/montserrat/800.css"; // Specify weight
import "@fontsource/montserrat/800-italic.css"; // Specify weight and style
import "@fontsource/montserrat/900.css"; // Specify weight
import "@fontsource/montserrat/900-italic.css"; // Specify weight and style
import { AuthProvider } from './hooks/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

