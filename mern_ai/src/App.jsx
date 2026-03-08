import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideBar from './component/SideBar/SideBar'
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'
import Home from './component/Home/Home'

function App() {
  const location = useLocation();
  const [count, setCount] = useState(0)
  const showSidebar = location.pathname === '/dashboard';

  return (
    <div className='App'>
      {showSidebar && <SideBar />}
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/' element={ <Home /> } />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/history' element={<History />} />
        <Route path='/admin' element={<Admin />} />

      </Routes>
    </div>
  )
}

export default App
