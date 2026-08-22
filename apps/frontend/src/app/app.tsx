import { ConfirmDialogProvider } from '../hooks/use-confirm';
import { TicketsPage } from './tickets-page/tickets-page';

export function App() {
  return (
    <ConfirmDialogProvider>
      <TicketsPage />
    </ConfirmDialogProvider>
  );
}

export default App;
