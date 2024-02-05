import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://hidkzaayaknxruyjvacp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZGt6YWF5YWtueHJ1eWp2YWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MTQxNDcsImV4cCI6MjAwOTQ5MDE0N30.iOyqa28eKHRd9IQFe453xew8wBN2Yjl7bg7YMgeSpXI"
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
      </SessionContextProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
