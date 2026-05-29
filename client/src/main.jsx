import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './providers/socket.jsx'
import { PeerProvider } from './providers/peer.jsx'


createRoot(document.getElementById('root')).render(
  
    // <BrowserRouter>
    // <SocketProvider>
    //     <PeerProvider>


    // <App />
    //     </PeerProvider>
    // </SocketProvider>
    // </BrowserRouter>

    <BrowserRouter>
  <SocketProvider>
    <PeerProvider>
      <App />
    </PeerProvider>
  </SocketProvider>
</BrowserRouter>

)
