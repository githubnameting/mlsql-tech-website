import React from 'react';
import RegisterForm from './Form';
import Banner from '../../components/Banner'
import './index.scss';

const RegisterPage = () => {
  return (
    <div className="app-page-wrapper">
      <div className="register-page">
        <Banner />
        <div className="register-page-form">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage
