import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Global.css'
import App from './App.tsx'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'izitoast/dist/css/iziToast.min.css';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
