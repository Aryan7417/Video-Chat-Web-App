import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/socket'
import { usePeer } from '../providers/peer';
import { data } from 'react-router-dom';
import { from } from 'node:stream/iter';

const room = () => {
  const{socket} = useSocket();
  const{ peer,createoffer } = usePeer()

  const handelNewUserJoined = useCallback( async (datā)=>{
    const {emailId} = data
    console.log('New user joined room', emailId)
    const offer =- await createoffer();
    socket.emit("call-user",{emailId,offer})

  },
  [createoffer,socket]

)

const handelIncommingCall = useCallback((data)=>{
  const {from,offer} = data;
  console.log("incomming call from :",from, offer)
},[])

  useEffect(()=>{
    socket.on("user-joined",handelNewUserJoined)
    socket.on('incomming-call',handelNewUserJoined)
    },[handelNewUserJoined,socket])


  return (
    <div className='room-page-container'>
        <h1>room page</h1>
    </div>
  )
}

export default room