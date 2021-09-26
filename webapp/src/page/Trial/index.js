import React from 'react';
import Banner from '../../components/Banner'
import './index.scss';
import Trail from './Trail'

const RegisterPage = () => {
  return (
    <div className="app-page-wrapper">
      <div className="register-page">
        <Banner />
        <div className="register-page-form">
          <Trail />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage
