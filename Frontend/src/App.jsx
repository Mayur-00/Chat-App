import React, {useEffect} from 'react'
import NavBar from './components/NavBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore';
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} =  useThemeStore()
  useEffect(() => {
    checkAuth()

  }, [checkAuth]);


  if(isCheckingAuth && !authUser){
    return(
        <div className='flex items-center justify-center h-screen'>
          <Loader className='size-10 animate-spin' />
        </div>
    )
  }

  
  return (
    <div data-theme={theme}>
      <NavBar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={ !authUser ? <SignupPage /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
        <Route path='/settings' element={<SettingsPage />} />

      </Routes>
      <Toaster />

    </div>
  )
}

export default App    