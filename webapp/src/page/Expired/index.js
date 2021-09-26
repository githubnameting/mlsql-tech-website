import React, { useEffect } from 'react';
import { AuthContext } from '../../context/Auth'
import { useHistory } from 'react-router-dom';
import './index.scss'

const Activation = () => {

  const { state } = React.useContext(AuthContext);
  const history = useHistory()
  useEffect(() => {
    setTimeout(() => {
      if (!state.username) {
        handleToLogin()
      } else {
        history.push('/activation')
      }
    }, 200)
  }, [state.username])

  const handleToLogin = () => {
    history.push('/login')
  }


  return (
    <div className="app-page-wrapper">
      <div className="expired-page">
        <div className="expired-page-title">链接已失效</div>
        <div className="expired-page-text">
          请<a href="/login">登录</a>后重新发送邮件
        </div>
      </div>
    </div>
    );
};

export default Activation
