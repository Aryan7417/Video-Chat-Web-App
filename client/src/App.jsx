import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/home.jsx'
import Room from './pages/room.jsx';

import { SocketProvider } from './providers/socket.jsx';


const App = () => {
  return (
    <>
    <Routes>
      {/* <SocketProvider> */}

        <Route path="/" element={<HomePage/>} />
        <Route path='/room/:roomId' element={<Room/>}/>
     
      {/* </SocketProvider> */}
     
      </Routes>
    <div>
      
    </div>
    </>
  )
}
export default App;
