import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Signup from './pages/Signup';
import { ImSpinner3 } from "react-icons/im";
import RedirectAuthenticatedUser from './routes/RedirectAuthenticatedUser';
import Login from './pages/Login';
import Layout from './Layout';
function App() {
const { checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
    
  }, [checkAuth]);



  if (isCheckingAuth)
    return (
      <section className="w-full h-full flex justify-center items-center">
        <div className="w-12 h-12 text-black">
          <ImSpinner3 className="animate-spin" />
        </div>
      </section>
    );
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Layout/>}>
      <Route path='/' element={<Home/>} />
      <Route path='/signup' element={
        <RedirectAuthenticatedUser>
          <Signup/>
        </RedirectAuthenticatedUser>} />
        <Route path='/login' element={
        <RedirectAuthenticatedUser>
          <Login/>
        </RedirectAuthenticatedUser>} />
        </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
