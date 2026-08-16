import * as ReactDOM from 'react-dom/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './app/app';

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// No StrictMode: the current @dnd-kit release doesn't support it under React 19 yet.
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
