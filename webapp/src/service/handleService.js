import axios from 'axios'
import { message } from 'antd';
const noNeedAuthPath = ['/home', '/register', '/reset_password', '/expired', '/expired?type=reset']

export default function initService(history, dispatch) {
  axios.interceptors.request.use((configs) => {
    return configs;
  });
  axios.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      const pathname = history.location.pathname
      if (error.response) {
        switch (error.response.status) {
          case 401:
            dispatch({ type: 'LOGOUT'})
            if (!noNeedAuthPath.includes(pathname)) {
              history.push('/home')
            }
            break
          default:
            break
        }
      }
      const result = error.response.data
      const msg = (result && result.msg) || 'Unknow Error'
      message.error(msg)
      return Promise.reject(error);
    }
  );
}
 