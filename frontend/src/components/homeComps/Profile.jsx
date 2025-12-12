import React from 'react'
import { useAuthStore } from '../../store/authStore'

function Profile() {
    const {user} = useAuthStore();
  return (
    <div className='flex flex-row gap-4 text-white font-bold'>
        <img className='w-16 h-16 rounded-full' src="https://tiermaker.com/images/template_images/2022/937085/genshin-chibi-937085/raiden-2png.png" alt='pfp'/>
        <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      </div>
      </div>
  )
}

export default Profile
