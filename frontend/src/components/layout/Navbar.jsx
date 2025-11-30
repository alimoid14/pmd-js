import { useNavigate } from "react-router-dom";
import { BsMenuAppFill } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const handleClick = async () => {
        await logout();
        navigate('/login');
    }
  return (
    <header className='fixed top-0 z-50 w-screen bg-white'>
        <nav className='w-full max-w-7xl mx-auto flex flex-row justify-between py-2 px-4 lg:px-6'>
            <div className='my-auto'>
              <BsMenuAppFill className='my-auto'/>
            </div>

            <div className='flex flex-row gap-4'>
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
