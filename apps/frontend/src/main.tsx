import * as ReactDOM from 'react-dom/client';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// No StrictMode: the current @dnd-kit release doesn't support it under React 19 yet.
root.render(<App />);
