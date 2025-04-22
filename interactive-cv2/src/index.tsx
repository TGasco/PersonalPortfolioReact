import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/generic/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ensure the element with id 'root' exists and is not null
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is an element with id 'root' in your HTML.");
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();