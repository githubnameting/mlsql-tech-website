import React, { useState, useEffect } from 'react';
import './index.scss'
import ResetFrom from './resetForm'
import SendEmail from './sendEmail'
import { useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const [fromEmail, changeFromEmail] = useState(false)
  const [hasReset, changeHasReset] = useState(false)
  const history = useHistory()
  const [token, changeToken] = useState('')

  useEffect(() => {
    const search = history.location.search
    if (search) {
      const token = search && search.split('token=')[1]
      changeToken(token)
      const flag = Boolean(token)
      changeFromEmail(flag)
    }
  })

  return (
    <div className="app-page-wrapper">
      <div className="reset_password-page">
        {
          !hasReset ? (
            <div className="reset_password-page-header">
              重置密码
            </div>
          ) : null
        }
        { 
          fromEmail ? (
            <ResetFrom token={token} onChangeHasRest={changeHasReset} />) : (
            <SendEmail />
          )      
        }
      </div>
    </div>
    );
};

export default ResetPassword
