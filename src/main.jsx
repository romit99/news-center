import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NewsCenter from './NewsCenter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewsCenter />
  </StrictMode>
);
