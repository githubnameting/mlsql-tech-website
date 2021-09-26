import Home from '../page/Home';
import RegisterPage from '../page/Register';
import Login from '../page/Login'
import Trail from '../page/Trial'
import Activation from '../page/Activation'
import Expired from '../page/Expired'

const routers = [
  {
    path:'/home',
    component: Home
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/register',
    component: RegisterPage
  },
  {
    path:'/trial',
    component: Trail
  },
  {
    path:'/activation',
    component: Activation
  },
  {
    path:'/expired',
    component: Expired
  }
]
export default routers