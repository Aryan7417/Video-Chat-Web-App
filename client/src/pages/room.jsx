import React, { useCallback, useEffect, useState, useRef } from 'react'
import ReactPlayer from "react-player"
import { useSocket } from '../providers/socket.jsx'
import { usePeer } from '../providers/peer.jsx';
// import { data } from 'react-router-dom';
// import { from } from 'node:stream/iter';

const room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream
  } = usePeer();

  const [myStream, setMyStream] = useState(null)
  const [remoteEmailId, setRemoteEMailId] = useState();

  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);



  const handelNewUserJoined = useCallback(async (data) => {
    const { emailId } = data
    console.log('New user joined room', emailId)
    const offer = await createOffer();
    socket.emit("call-user", { emailId, offer })
    console.log(offer)
    setRemoteEMailId(emailId)

  },
    [createOffer, socket]

  )



  const handelIncommingCall = useCallback(async (data) => {
    const { from, offer } = data;

    console.log("incomming call from :", from, offer)
    const ans = await createAnswer(offer)
    socket.emit("call-accepted", { emailId: from, ans })
    setRemoteEMailId(from)
  }, [createAnswer, socket])

  const handelCallAccepted = useCallback(async (data) => {
    const { ans } = data
    console.log("call Got Accepted")
    await setRemoteAns(ans)
  }, [setRemoteAns])

  const getUserMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: true
    });
    setMyStream(stream)
    // console.log(myStream);
  }, [sendStream])


 const handleNegosiation = useCallback(async () => {
  const offer = await createOffer();

  socket.emit("peer:nego:needed", {
    offer,
    emailId: remoteEmailId,
  });
}, [createOffer, socket, remoteEmailId]);

  useEffect(() => {
    socket.on("user-joined", handelNewUserJoined)
    socket.on('incomming-call', handelIncommingCall)
    socket.on('call-accepted', handelCallAccepted)

    return () => {
      socket.off("user-joined", handelNewUserJoined)
      socket.off('incomming-call', handelIncommingCall)
      socket.off('call-accepted', handelCallAccepted)
    }


  }, [handelCallAccepted, handelIncommingCall, handelNewUserJoined, socket])



  useEffect(() => {
    peer.addEventListener('negotiationneeded', handleNegosiation)

    return () => {
      peer.removeEventListener('negotiationneeded', handleNegosiation)
    }

  }, [])


  useEffect(() => {
    getUserMedia();

  }, []);

  useEffect(() => {
    console.log("My Stream", myStream)
  }, [myStream])


  // const { remoteStream } = usePeer();
  useEffect(() => {
    if (videoRef.current && myStream) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
  if (remoteVideoRef.current && remoteStream) {
    remoteVideoRef.current.srcObject = remoteStream;
  }
}, [remoteStream]);

useEffect(() => {
  console.log("Remote Stream:", remoteStream);
}, [remoteStream]);



  //   const peerData = usePeer();
  // console.log(peerData);

  return (
    <div className='room-page-container'>
      <h1>room page</h1>
      <h3>you are connected to {remoteEmailId}</h3>
      <button
  onClick={() => {
    console.log("BUTTON CLICKED");
    console.log(myStream);
    sendStream(myStream);
  }}
>
  Send My Video
</button>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="500"
      />

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width="500"
      />


    </div>
  )
}

export default room