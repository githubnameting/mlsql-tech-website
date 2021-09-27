import axios from 'axios'
import { Base64 } from 'js-base64'

export default {
  submitLogin: ({ username, password }) => {
    return axios.post('/api/user/authentication', {}, {
      headers: {
        Authorization: 'Basic ' + Base64.toBase64(username + ':' + password),
      }
    })
  },
  submitSignUp: (params) => axios.post('/api/user/join', params),
  handleLogout: () => axios.delete('/api/user/authentication'),
  getUserInfo: () => axios.get('/api/user/me'),
  resendEmail: () => axios.post('/api/user/resend_email'), // 重新发送激活邮件
  getActivationStatus: () => axios.get(`/api/user/activation`), // 获取是否激活
  getBaizeAddress: () => axios.get(`/api/baize/host`), // 获取试用地址
  resetPassword: (data) => axios.post(`/api/user/reset_password`, data),
  sendResetEmail: (data) => axios.post(`/api/user/send_reset_email`, data)
}