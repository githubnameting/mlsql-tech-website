import React, { Fragment, useState } from 'react';
import { Form, Input, Button } from 'antd';
import './index.scss'
import { useIntl } from 'react-intl';
import { user } from '../../service'
import emailIcon from '../../image/email.svg'
import { LeftOutlined } from '@ant-design/icons'

const SendEmailForm = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [hasSend, changeHasSend] = useState(false)
  const [loading, changeLoading] = useState(false)

  const onFinish = (values) => {
    sendResetEmail(values)
  };

  async function sendResetEmail (values) {
    try {
      changeLoading(true)
      await user.sendResetEmail(values)
      changeLoading(false)
      changeHasSend(true)
    } catch (e) {
      changeLoading(false)
    }
  }

  return (
    <div className="reset_password-page-form">
      {
        hasSend ? (
      
      <div className="reset_password-page-success">
        <div className="reset_password-page-success-icon">
          <img src={emailIcon} alt="" />
        </div>
        <div className="reset_password-page-success-text">密码重置链接已经发送到您的邮箱，请查收邮件。</div>
        <div className="back-login-btn">
          <a href="/login"><LeftOutlined /> 返回登录</a></div>
      </div>) :
      ( <Fragment>
          <div className="reset_password-page-form-title">我们会发送一个链接到您的邮箱，点击之后可以重设密码</div>
          <Form
            form={form}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: intl.formatMessage({id: 'user.email.valid'}),
                },
                {
                  required: true,
                  message: intl.formatMessage({id: 'user.email.required'}),
                }
              ]}
            >
              <Input placeholder="邮件"/>
            </Form.Item>
          <Form.Item>
            <Button loading={loading} className="red-btn" type="primary" htmlType="submit">
              发送邮件
            </Button>
          </Form.Item>
        </Form>
        <div className="back-login-btn">
          <a href="/login"><LeftOutlined /> 返回登录</a></div>
        <div className="reset_password-page-form-foot">如果您还没有 MLSQL Lab 账号， 请点击<a href="/register">注册</a></div>
      </Fragment>)
    }
    </div>
    );
};

export default SendEmailForm