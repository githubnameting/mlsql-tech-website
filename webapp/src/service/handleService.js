import axios from 'axios'
import { message } from 'antd';

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
            if (pathname !== '/home' && pathname !== '/register') {
              history.push('/home')
            }
            break
          default:
            break
        }
      }
      const result = error.response.data
      if (pathname !== '/home' && pathname !== '/register') {
        const msg = (result && result.msg) || 'Unknow Error'
        message.error(msg)
      }
      return Promise.reject(error);
    }
  );
}
 