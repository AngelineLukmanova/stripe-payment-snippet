import React from 'react';
import ReactDOM from 'react-dom/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css';
import App from './App';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

const hasuraUrl = process.env.REACT_APP_URI;
const clientValue = process.env.REACT_APP_CLIENT_VALUE;

const client = new ApolloClient({
  uri: hasuraUrl,
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': clientValue,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </ApolloProvider>
  </React.StrictMode>
);
