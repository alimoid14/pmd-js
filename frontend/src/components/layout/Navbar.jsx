import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { BsMenuAppFill } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {useNotificationStore} from '../../store/notificationStore';

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [notificationBarOpen, setNotificationBarOpen] = useState(false);
    const {active, resetNotifications, notifications} = useNotificationStore();
    const handleClick = async () => {
        await logout();
        resetNotifications();
        navigate('/login', { replace: true });
    }

  return (
    <>
    <header className='fixed top-0 z-50 w-screen bg-white'>
        <nav className='relative w-full max-w-7xl mx-auto flex flex-row justify-between py-2 px-4 lg:px-6'>
            <div className='my-auto'>
              <BsMenuAppFill className='my-auto'/>
            </div>

            <div className='flex flex-row gap-4'>
                <div className="my-auto relative hover:cursor-pointer" onClick={() => setNotificationBarOpen(!notificationBarOpen)}>
                    <FaRegBell />
                    {active > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {active}
        </span>
      )}
                </div>
                <div className='my-auto'>
                    <BiUser />
                </div>
                <div>
                    <button onClick={handleClick} className='bg-red-500 hover:bg-red-700 text-white px-4 rounded-full'>
                        Logout
                    </button>
                </div>
            </div>
            {notificationBarOpen && <div className='absolute top-11 right-0 p-4 mr-4 lg:mr-6 flex flex-col gap-2 bg-linear-to-b from-white to-gray-200'>
      {notifications.map((noti) => (
        <div key={noti._id} className='p-4 text-amber-500 border-b border-b-amber-700 font-bold'>
          <p>{noti.message}</p>
        </div>
      ))}
      </div>}
        </nav>
      
    </header>
    
    </>
  )
}

export default Navbar
