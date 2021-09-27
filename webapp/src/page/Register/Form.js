import React, { useContext, useState } from 'react';
import { useIntl } from "react-intl";
import { Form, Input, Checkbox, Button } from 'antd';
import { user } from '../../service'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/Auth'

const formItemLayout = {
  labelCol: {
    xs: { span: 18 },
    sm: { span: 6 },
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
      span: 18,
      offset: 6,
    },
  },
};
const RegisterForm = () => {
  const intl = useIntl()
  const [form] = Form.useForm();
  const history = useHistory()
  const { dispatch } = useContext(AuthContext);
  const [loading, changeLoading] = useState(false)


  const onFinish = (values) => {
    const {
      name,
      email,
      password,
      telephone,
      company
    } = values
    const params = {
      name,
      email,
      password,
      telephone,
      company
    }
    handleRegister(params)
  };
  const handleRegister = async (params) => {
    try {
      changeLoading(true)
      await user.submitSignUp(params)
      changeLoading(false)
      window.gtag('event', 'register')
      const { name, email } = params
      dispatch({ type: 'LOGIN', payload: { email, username: name } })
      history.push('/activation')
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
    <div className="register-wrapper">
      <Form
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label={intl.formatMessage({id: 'user.nickname'})}
          rules={[{ required: true, message: intl.formatMessage({id: 'user.nickname.required'}) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={intl.formatMessage({id: 'user.email'})}
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
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={intl.formatMessage({id: 'user.password'})}
          rules={[{
              required: true,
              validator: validatePassword,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password_confirm"
          label={intl.formatMessage({id: 'user.password_confirm'})}
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
          <Input.Password />
        </Form.Item>
        
        <Form.Item
          name="company"
          label={intl.formatMessage({id: 'user.company'})}
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'user.company.required'}),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telephone"
          label={intl.formatMessage({id: 'user.phone_number'})}
          rules={[{ required: true, message: intl.formatMessage({id: 'user.phone_number.required'}) },
            {
              pattern: new RegExp(/^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/),
              message: '手机号码不正确，请检查后重试'
            }
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('同意后才能创建账号')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox className="register-check"> MLSQL 团队有权对试用环境进行维护和数据清理，对于重要文件请及时下载和保存。</Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button loading={loading} type="primary" size="large" className="red-btn" htmlType="submit">创建账号</Button>
          <div className="register-wrapper-gologin">已有账号? 点此<a href="/login">登录</a></div>
        </Form.Item>
      </Form>
    </div>
    );
};

export default RegisterForm
