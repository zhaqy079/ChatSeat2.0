import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
//import '@fullcalendar/common/main.css';     
//import '@fullcalendar/timegrid/main.css';
import { Provider } from "react-redux";
import store from "./state/store";
import { restoreSessionAndHydrateRedux } from "./authBootstrap";

restoreSessionAndHydrateRedux(store.dispatch); // hydrate Redux on startup

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
