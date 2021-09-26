import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { user } from '../../service'
import Banner from '../../components/Banner'
import { useHistory } from 'react-router-dom';

const Activation = () => {
  const [restTime, changeTime] = useState(0)
  const history = useHistory()

  useEffect(() => {
    handleGetActivationStatus()
  }, [])

  const changeRestTime = () => {
    const interval = setInterval(() => {
      changeTime(restTime => restTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }

  const handleResendEmail = async () => {
    try {
      await user.resendEmail()
      changeTime(60);
      changeRestTime()
    } catch (e) {
    }
  }
  const handleGetActivationStatus = async () => {
    try {
      const res = await user.getActivationStatus()
      if (res.data.activation) {
        history.push('/trial')
      }
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className="app-page-wrapper">
      <div className="register-page">
        <Banner />
        <div className="register-page-form">
          <div className="confirm-email">
            <h1 className="confirm-email-title">请查收邮件！</h1>
            <div className="confirm-email-text">感谢您申请使用 MLSQL Lab 免费试用， 请及时查看您的邮箱并验证邮箱地址，通过验证后，我们将指导您玩转 MLSQL</div>
            <div className="confirm-email-text">若您没有收到邮件，请检查垃圾邮件及"其他"收件箱</div>
            <div className="confirm-email-resend">
              <Button disabled={restTime>0} onClick={handleResendEmail}>
                { restTime>0 ? `${restTime}s 后` : '' }  重新发送验证邮件</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Activation
