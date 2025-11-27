import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Signup from './pages/Signup';
import { ImSpinner3 } from "react-icons/im";
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
    <Route path='/' element={<Home/>} />
    <Route path='/signup' element={<Signup/>} /></Routes>
    </BrowserRouter>
  )
}

export default App
