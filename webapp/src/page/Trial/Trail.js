import React, { useEffect, useContext } from 'react';
import { user } from '../../service'
import { Button } from 'antd'
import weixinCode from '../../image/WechatIMG80.png'
import { AuthContext } from '../../context/Auth'; 
import email from '../../image/email.svg'

const TailBaize = () => {
  const [ip, changeIp] = React.useState('')
  const { state } = useContext(AuthContext)

  const getBaizeAddress = async () => {
    try {
      const res = await user.getBaizeAddress()
      changeIp(`${res.data.ip}/#/login?username=${state.username}`)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (state.username) {
      getBaizeAddress()
    }
  }, [state.username])

  const handleClickTrial = () => {
    window.gtag('event', 'useBaize', {
      username: state.username
    })
  }

  return (
    <div className="trial-page-text">
      <div className="trial-page-text-title">MLSQL Lab 已经准备好了</div>
      <div className="trial-page-text-btn">
        <Button onClick={handleClickTrial} disabled={!ip} type="primary" size="large">
          <a href={ip} target="_blank" rel="noreferrer">开始试用</a>
        </Button>
      </div>
      <div className="trial-page-text-img">
        <img src={weixinCode} alt=""/><br />
        <span>扫码入群，专业人员及时答疑</span>
      </div>
      <div className="trial-page-text-email">
        <a href="mailto:mlsql_lab@kyligence.io;"><img src={email} alt="" />联系技术支持</a>
      </div>
    </div>
  );
};

export default TailBaize
