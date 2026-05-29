import React, { useEffect } from 'react'
import { useSocket } from '../providers/socket'
import { data } from 'react-router-dom';

const room = () => {
  const{socket} = useSocket();

  const handelNewUserJoined = (datā)=>{
    const {emailId} = data
    console.log('Nwe user joined room', emailId)

  }

  useEffect(()=>{
    socket.on("user-joined",handelNewUserJoined)
  },[])





  return (
    <div className='room-page-container'>
        <h1>room page</h1>
    </div>
  )
}

export default room