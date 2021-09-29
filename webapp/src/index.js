import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './css/variable.scss'
import './index.css';
import './common.scss'
import 'antd/dist/antd.css';
import App from './App';
import "./icons";

ReactDOM.render(
  (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
document.getElementById('root'));
