import React, { Fragment, useState } from 'react';
import { useIntl } from "react-intl";
import { Form, Input, Button } from 'antd';
import './index.scss'
import { user } from '../../service'
import successIcon from '../../image/success.svg'
import { useHistory } from 'react-router-dom';
const ResetForm = (props) => {
  const { onChangeHasRest, token } = props
  const intl = useIntl();
  const [form] = Form.useForm();
  const [ hasReset, changeHasReset] = useState(false)
  const [loading, changeLoading] = useState(false)
  const history = useHistory()

  const passwordTips = ['密码长度为 8~255 个字符。', '至少包含 1 个英文字母、1 个数字 和 1 个特殊字符。', '特殊字符包括：~!@#$%^&*(){}|:<>?[];\',./']

  const onFinish = (values) => {
    const params = {
      password: values.password,
      token
    }
    resetPassword(params)
  };

  async function resetPassword (values) {
    try {
      changeLoading(true)
      const res = await user.resetPassword(values)
      changeHasReset(true)
      onChangeHasRest(true)
      changeLoading(false)
      if (res.code === 'ML-100400001') {
        history.push('/expired?type=reset')
      }
    } catch (e) {
      changeLoading(false)
    }
  }

  const validatePassword = (rule, value, callback) => {
    const length = (value || '').replace(/[^\x00-\xff]/g, 'AA').length
    const reg1 = /.*?[A-Za-z]/
    const reg2 = /.*?[0-9]/
    const reg3 = /.*?[~!@#$%^&*(){}|:<>?[\];\',.\/]/
    const reg = /^[A-Za-z0-9~!@#$%^&*(){}|:<>?[\];\',.\/]+$/
    if (!value && !(value || '').trim()) {
      return Promise.reject(intl.formatMessage({id: 'user.password.required'}))
    } else if (length < 8 || length > 255) {
      return Promise.reject(intl.formatMessage({id: 'user.password.valid1'}))
    } else if (!reg1) {
      return Promise.reject(intl.formatMessage({id: 'user.password.valid2'}))
    } else if (!reg2) {
      return Promise.reject(intl.formatMessage({id: 'user.password.valid3'}))
    } else if (!reg3) {
      return Promise.reject(intl.formatMessage({id: 'user.password.valid4'}))
    } else if (!reg) {
      return Promise.reject(intl.formatMessage({id: 'user.password.valid5'}))
    } else {
      return Promise.resolve()
    }
  }

  return (
    <div className="reset_password-page-form">
      { hasReset ? (<div className="reset_password-page-send">
          <div className="reset_password-page-send-icon">
            <img src={successIcon} alt="" />
          </div>
          <div className="reset_password-page-send-text">您的密码已更改</div>
          <div className="reset_password-page-send-btn"><Button className="red-btn">
            <a href="/login">登录</a></Button></div>
        </div>) :
        (
          <Fragment>
            <div className="reset_password-page-form-title">请设置您的新密码</div>
            <Form
              form={form}
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="password"
                rules={[{
                    required: true,
                    validator: validatePassword,
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="新密码" />
              </Form.Item>

              <Form.Item
                name="password_confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'user.password_confirm.required'}),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(intl.formatMessage({id: 'user.password_confirm.valid'})));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="确认密码" />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} className="red-btn" type="primary" htmlType="submit">
                  重置密码
                </Button>
              </Form.Item>
            </Form>
            <div className="reset_password-page-form-password-tip">
              <div className="reset_password-page-form-password-tip-title">安全密码提示：</div>
              {
                passwordTips.map(v => (
                  <div key={v} className="reset_password-page-form-password-tip-text"><span className="dot"></span>{v}</div>
                ))
              }
            </div>
          </Fragment>)
      }
    </div>
  );
};

export default ResetForm