
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Header/>
      <Outlet/>
    </div>
  )
}
