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
      changeIp(`${res.data.ip}?username=${state.username}`)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getBaizeAddress()
  }, [])

  const handleClickTrail = () => {
    window.gtag('event', 'freetrail', {
      'event_callback': function () {
        console.log('trail')
      }
    })
  }

  return (
    <div className="trail-page-text">
      <div className="trail-page-text-title">MLSQL Lab 已经准备好了</div>
      <div className="trail-page-text-btn">
        <Button onClick={handleClickTrail} disabled={!ip} type="primary" size="large">
          <a href={ip} target="_blank" rel="noreferrer">开始试用</a>
        </Button>
      </div>
      <div className="trail-page-text-img">
        <img src={weixinCode} alt=""/><br />
        <span>扫码入群，专业人员及时答疑</span>
      </div>
      <div className="trail-page-text-email">
        <a href="mailto:MLSQL_LAB@Kyligence.io;"><img src={email} alt="" />联系技术支持</a>
      </div>
    </div>
  );
};

export default TailBaize
