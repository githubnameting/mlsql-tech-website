import React, { useContext, useState } from 'react';
import { useIntl } from "react-intl";
import { Form, Input, Checkbox, Button } from 'antd';
import { user } from '../../service'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/Auth'
import SvgIcon from '../../components/SvgIcon';
import { InfoCircleOutlined } from '@ant-design/icons'

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
    const length = (value || '').replace(/[^\x00-\xff]/g, 'AA').length
    const reg1 = /.*?[A-Za-z]/.test(value)
    const reg2 = /.*?[0-9]/.test(value)
    const reg3 = /.*?[~!@#$%^&*(){}|:<>?[\];\',.\/]/.test(value)
    const reg = /^[A-Za-z0-9~!@#$%^&*(){}|:<>?[\];\',.\/]+$/.test(value)
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
  const validateCompany = (rule, value, callback) => {
    if (!(value || '').trim()) {
      return Promise.reject('请输入公司名称')
    } else {
      return Promise.resolve()
    }
  }
  const validateTelephone = (rule, value, callback) => {
    const reg = /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/
    if (!(value || '').trim()) {
      return Promise.reject(intl.formatMessage({id: 'user.phone_number.required'}) )
    } else if (value.length > 11 || !reg.test(value)){
      return Promise.reject(intl.formatMessage({id: 'user.phone_number.valid'}))
    } else {
      return Promise.resolve()
    }
  }

  const handleTrim = (key) => {
    const value = form.getFieldValue(key)
    form.setFieldsValue({ [key]: (value || '').trim() })
  }
  const tooltipInfo = () => (<div className="tooltip">
    <div className="test">
      <div className="reset_password-page-form-password-tip-title">安全密码提示：</div>
      {
        passwordTips.map(v => (
          <div key={v} className="reset_password-page-form-password-tip-text"><span className="dot"></span>{v}</div>
        ))
      }
    </div>
  </div>)
  const passwordTips = ['密码长度为 8~255 个字符。', '至少包含 1 个英文字母、1 个数字 和 1 个特殊字符。', '特殊字符包括：~!@#$%^&*(){}|:<>?[];\',./']
  const tipIcon = 'more_info_16'

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
          label={intl.formatMessage({id: 'user.username'})}
          rules={[
            { required: true, message: intl.formatMessage({id: 'user.username.required'}) },
            {
              pattern: new RegExp(/^\w+$/), message: intl.formatMessage({id: 'user.username.valid'})
            },
          ]}
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
          tooltip={{ 
            title: tooltipInfo,
            color: '#fff',
            icon: <InfoCircleOutlined />,
          }}
          label={intl.formatMessage({id: 'user.password'})}
          rules={[
            {
              required: true,
              validator: validatePassword
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
                return Promise.reject(new Error(intl.formatMessage({id: 'user.password_confirm.valid'})));
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
              validator: validateCompany,
              message: intl.formatMessage({id: 'user.company.required'}),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telephone"
          label={intl.formatMessage({id: 'user.phone_number'})}
          rules={[
            { required: true, message: intl.formatMessage({id: 'user.phone_number.required'}) },
            { validator: validateTelephone }
          ]}
        >
          <Input onBlur={() => handleTrim('telephone')} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({id:'user.agree.valid'}))),
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
