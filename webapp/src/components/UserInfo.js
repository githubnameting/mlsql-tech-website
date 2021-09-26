import React, { Fragment, useContext, useEffect } from 'react';
import { Menu, Dropdown } from 'antd';
import { useHistory } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons'
import { AuthContext } from '../context/Auth'
import { user } from '../service'

const UserInfo = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { username } = state
  const history = useHistory()
  const handleLogout = async () => {
    try {
      await user.handleLogout()
      history.push('/login')
      dispatch({ type: 'LOGOUT'})
    } catch (e) {}
  }
  async function handleGetUerInfo () {
    try {
      const res = await user.getUserInfo()
      const { email, username } = res.data
      dispatch({ type: 'LOGIN', payload: { email, username } })
    } catch (e) {}
  }

  useEffect(() => {
    handleGetUerInfo()
  }, [])

  const handleClick = ({ key }) => {
    if (key.startsWith('/')) {
      history.push(key)
    } else {
      handleLogout()
    }
  }
  const autoMenu = ( // 未登录使用
    <Menu onClick={handleClick}>
      {
        !username ? (<Fragment>
          <Menu.Item key="/login">登录</Menu.Item>
          <Menu.Item key="/register">注册</Menu.Item>
        </Fragment>) : (
          <Fragment>
            <Menu.Item key="username" disabled>{username}</Menu.Item>
            <Menu.Item key="logout">退出</Menu.Item>
          </Fragment>
        )
      }
    </Menu>
  )
  return (
    <div className="user-info">
      <Dropdown overlay={autoMenu}>
        <UserOutlined />
      </Dropdown> 
    </div>
  );
}

export default UserInfo;