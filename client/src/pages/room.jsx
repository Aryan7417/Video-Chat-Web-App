import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/socket.jsx'
import { usePeer } from '../providers/peer.jsx';
// import { data } from 'react-router-dom';
// import { from } from 'node:stream/iter';

const room = () => {
  const{socket} = useSocket();
  const{ peer,createOffer } = usePeer()

  const handelNewUserJoined = useCallback( async (data)=>{
    const {emailId} = data
    console.log('New user joined room', emailId)
    const offer = await createOffer();
    socket.emit("call-user",{emailId,offer})
    console.log(offer)

  },
  [createOffer,socket]

)

const handelIncommingCall = useCallback((data)=>{
  const {from,offer} = data;
  console.log("incomming call from :",from, offer)
},[])

  useEffect(()=>{
    socket.on("user-joined",handelNewUserJoined)
    socket.on('incomming-call',handelIncommingCall)
    },[handelNewUserJoined,socket])


  return (
    <div className='room-page-container'>
        <h1>room page</h1>
    </div>
  )
}

export default room