import Home from '../page/Home';
import RegisterPage from '../page/Register';
import Login from '../page/Login'
import Trail from '../page/Trial'
import Activation from '../page/Activation'
import Expired from '../page/Expired'
import ResetPassword from '../page/ResetPassword'

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
  },
  {
    path:'/reset_password',
    component: ResetPassword
  }
]
export default routers