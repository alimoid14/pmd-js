import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';
import { useProjectStore } from './store/projectStore';
import { useSocketStore } from './store/socketStore';
import { useNotificationStore } from './store/notificationStore';
import { useEffect } from 'react';
import Signup from './pages/Signup';
import { ImSpinner3 } from "react-icons/im";
import RedirectAuthenticatedUser from './routes/RedirectAuthenticatedUser';
import Login from './pages/Login';
import Layout from './Layout';
import Project from './pages/Project';
import { ProtectedRoute } from './routes/ProtectedRoute';
function App() {
const { checkAuth, isCheckingAuth, user } = useAuthStore();
const {getProjects, getContributions} = useProjectStore();
const {getNotifications} = useNotificationStore();
const {socket, connectSocket, disconnectSocket} = useSocketStore();
const {addNotification} = useNotificationStore();

  useEffect(() => {
    checkAuth();
    getProjects();
    getContributions();
    getNotifications();
  }, [checkAuth, getProjects, getNotifications, getContributions]);


  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);   // connect when user logs in
    } else {
      disconnectSocket();        // disconnect when user logs out
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      console.log("🔔 Notification Received:", data);
      addNotification(data); // Save in Zustand
    };

    socket.on("notification", handler);

    return () => socket.off("notification", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);


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
      <Route path='/' element={<ProtectedRoute>
        <Home/>
        </ProtectedRoute>
      } />
      <Route path='/projects/:projectId' element={<ProtectedRoute><Project/></ProtectedRoute>} />
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
