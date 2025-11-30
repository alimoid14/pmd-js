import React from 'react'
import { useAuthStore } from '../../store/authStore'

function Profile() {
    const {user} = useAuthStore();
  return (
    <div className='flex flex-row gap-4'>
        <img src={user.image} alt='profile picture'/>
        <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      </div>
      </div>
  )
}

export default Profile
