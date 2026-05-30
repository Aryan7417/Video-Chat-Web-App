import React  from "react";
import "../App.css"
import {useSocket} from "../providers/socket.jsx"
import { useState ,useEffect,useCallback}from "react";
import { useNavigate } from "react-router-dom";


const HomePage =()=>{
    const {socket} = useSocket()
    const navigate = useNavigate()


    const [email,setEmail]= useState("")
    const [roomId,setRoomid]= useState("")

    const handleRoomJoined =useCallback(({roomId})=>{
        navigate(`/room/${roomId}`)
    },[navigate])

  useEffect(() => {
  socket.on("joined-room", handleRoomJoined);

  return () => {
    socket.off("joined-room", handleRoomJoined);
  };
}, [handleRoomJoined,socket]);

    const handlejoinRoom = ()=>{
        socket.emit("join-room",{emailId:email,roomId})

    }

    
    



    return(

        <div className="home-container">
        <div className="input-container">
            <input value={email} onChange={e=>setEmail(e.target.value)}    type="text" placeholder="Enter your email here"/>
            <input value={roomId} onChange={e=>setRoomid(e.target.value)}   type="text" placeholder="Enter Room Code"/>
            <button onClick={handlejoinRoom}>Enter Room</button>
          
        </div>
    </div>
    
)
}

export default HomePage 