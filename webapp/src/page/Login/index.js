import React from 'react';
import { useIntl } from "react-intl";
import { Form, Input, Button } from 'antd';
import './index.scss'
import { user } from '../../service'
import { AuthContext } from '../../context/Auth'
import { useHistory } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const LoginForm = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { dispatch } = React.useContext(AuthContext)
  const history = useHistory()

  const onFinish = (values) => {
    handleLogin(values)
  };

  async function handleLogin (values) {
    try {
      await user.submitLogin(values)
      handleGetUerInfo()
      const res = await user.getActivationStatus()
      if (res.data.activation) {
        history.push('/trial')
      } else {
        history.push('/activation')
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function handleGetUerInfo () {
    try {
      const res = await user.getUserInfo()
      const { email, username } = res.data
      dispatch({ type: 'LOGIN', payload: { email, username } })
    } catch (e) {}
  }

  return (
    <div className="app-page-wrapper">
      <div className="login-page">
        <div className="login-page-header">MLSQL Lab</div>
        <div className="login-page-form">
          <Form
            form={form}
            {...formItemLayout}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '用户名不能为空',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label={intl.formatMessage({id: 'user.password'})}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({id: 'user.password.required'}),
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button className="red-btn" type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="login-page-foot">如果您还没有 MLSQL Lab 账号， 请点击<a href="/register">注册</a></div>
      </div>
    </div>
    );
};

export default LoginForm
