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
      console.log(res.data, 'res')
      if (res.code === 'ML-100400001') {
        history.push('/expired?type=reset')
      }
    } catch (e) {
      changeLoading(false)
    }
  }

  const validatePassword = (rule, value, callback) => {
    const reg = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[~!@#$%^&*(){}|:<>?[\];\',.\/])[A-Za-z0-9~!@#$%^&*(){}|:<>?[\];\',.\/]{8,255}$/
    if (!value) {
      return Promise.reject(intl.formatMessage({id: 'user.password.required'}))
    } else if (!reg.test(value)) {
      return Promise.reject('密码长度在 8 ~ 255 之间，至少包含 1 个英文字母， 1 个数字和 1 个特殊字符 (~!@#$%^&*(){}|:<>?[];\',./), 不包含非法字符')
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
                <Input.Password  placeholder="新密码" />
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
                      return Promise.reject(new Error(intl.formatMessage({id: 'user.password_confirm.required'})));
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
              <div className="reset_password-page-form-password-tip-text"><span className="dot"></span>至少包含 8 个字符。</div>
              <div className="reset_password-page-form-password-tip-text"><span className="dot"></span>至少包含 1 个英文字母、1 个数字 和 1 个特殊字符。</div>
              <div className="reset_password-page-form-password-tip-text"><span className="dot"></span>特殊字符包括：~^,./</div>
            </div>
          </Fragment>)
      }
    </div>
  );
};

export default ResetForm