import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as dotenv from 'dotenv';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// Allow use of .env
dotenv.config();

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
