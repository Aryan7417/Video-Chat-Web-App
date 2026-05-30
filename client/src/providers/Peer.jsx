import React, { useMemo, useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext)


export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null)
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"

                ]
            }
        ]

    }), [])

    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer)
        return offer
    }


    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }
    const setRemoteAns = async (ans) => {
        await peer.setRemoteDescription(ans)
    };


    const sendStream = (stream) => {
  console.log("sendStream called");
  console.log("stream =", stream);

  if (!stream) {
    console.log("STREAM IS NULL");
    return;
  }

  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    console.log("Track:", track.kind);

    const alreadyExists = peer
      .getSenders()
      .some((sender) => sender.track === track);

    console.log("alreadyExists =", alreadyExists);

    if (!alreadyExists) {
      peer.addTrack(track, stream);
      console.log("Track Added");
    }
  });
};



    const handleTrackEvent = useCallback((ev) => {
  console.log("TRACK RECEIVED", ev);
  const streams = ev.streams;
  setRemoteStream(streams[0]);
}, []);

    // const handleNegosiation = useCallback(async () => {
    //     const offer = await createOffer();

    //     socket.emit("peer:nego:needed", {
    //         offer,
    //         emailId: remoteSocketId
    //     });
    // }, [createOffer, socket, remoteSocketId]);



    useEffect(() => {
        peer.addEventListener("track", handleTrackEvent);
       // peer.addEventListener("negotiationneeded", handleNegosiation);




        return () => {
            peer.removeEventListener("track", handleTrackEvent);
            //peer.removeEventListener("negotiationneeded", handleNegosiation);


        };
    }, [peer, handleTrackEvent,]);

    console.log({
        sendStream,
        remoteStream
    });

    return (
        <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream }}>
            {props.children}
        </PeerContext.Provider>
    )

}
