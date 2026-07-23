import { ConfirmDialogProvider } from '../hooks/use-confirm';
import { Board } from './board/board';

export function App() {
  return (
    <ConfirmDialogProvider>
      <Board />
    </ConfirmDialogProvider>
  );
}

export default App;
