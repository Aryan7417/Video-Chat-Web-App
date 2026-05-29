import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/home.jsx'
import Room from './pages/room.jsx';

import { SocketProvider } from './providers/socket.jsx';
import { peerProvider } from './providers/peer.jsx';


const App = () => {
  return (
    <>
      <SocketProvider>
        <peerProvider>

    <Routes>

        <Route path="/" element={<HomePage/>} />
        <Route path='/room/:roomId' element={<Room/>}/>
     
      </Routes>

        </peerProvider>
      </SocketProvider>
     
    <div>
      
    </div>
    </>
  )
}
export default App;
