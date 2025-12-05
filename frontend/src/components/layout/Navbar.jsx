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
    const {unreadCount} = useNotificationStore();
    const handleClick = async () => {
        await logout();
        navigate('/login', { replace: true });
    }
  return (
    <header className='fixed top-0 z-50 w-screen bg-white'>
        <nav className='w-full max-w-7xl mx-auto flex flex-row justify-between py-2 px-4 lg:px-6'>
            <div className='my-auto'>
              <BsMenuAppFill className='my-auto'/>
            </div>

            <div className='flex flex-row gap-4'>
                <div className="my-auto relative">
                    <FaRegBell />
                    {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {unreadCount}
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
        </nav>
      
    </header>
  )
}

export default Navbar
