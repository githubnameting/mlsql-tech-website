import React, { useState } from 'react';
import { useIntl } from "react-intl";
import { Form, Input, Button } from 'antd';
import './index.scss'
import { user } from '../../service'
import { useHistory } from 'react-router-dom';
const LoginForm = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const history = useHistory()
  const [loading, changeLoading] = useState(false)

  const onFinish = (values) => {
    handleLogin(values)
  };

  async function handleLogin (values) {
    try {
      changeLoading(true)
      await user.submitLogin(values)
      const res = await user.getActivationStatus()
      changeLoading(false)
      if (res.data.activation) {
        history.push('/trial')
      } else {
        history.push('/activation')
      }
    } catch (e) {
      changeLoading(false)
    }
  }

  return (
    <div className="app-page-wrapper">
      <div className="login-page">
        <div className="login-page-header">MLSQL Lab</div>
        <div className="login-page-form">
          <Form
            form={form}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '用户名不能为空',
                },
              ]}
            >
              <Input placeholder={intl.formatMessage({id: 'user.username'})} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({id: 'user.password.required'}),
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item className="login-page-form-forgot" >
              <a href="/reset_password">忘记密码？</a>
            </Form.Item>
            <Form.Item>
              <Button loading={loading} className="red-btn" type="primary" htmlType="submit">
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
