import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../services/peer'

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId]=useState(null);
    const [myStream,setMyStream]=useState();

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined room`)
        setRemoteSocketId(id);
    })

    const handleCallUser =useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        const offer = await peer.getOffer();
        socket.emit("user:call",{to:remoteSocketId,offer})
        setMyStream(stream);
    },[remoteSocketId,socket])

    const handleIncommingCall=useCallback(({from ,offer})=>{
        console.log(`Incomming Call `,from ,offer)
    })

    useEffect(()=>{
        socket.on('user:joined',handleUserJoined);
        socket.on("incomming:call",handleIncommingCall)
        return () =>{
            socket.off('user:joined',handleUserJoined);
            socket.off("incomming:call",handleIncommingCall);
        }
    },[socket,handleUserJoined,handleIncommingCall])
  return (
    <div>
      Room Page
      <h4>{remoteSocketId ? "connected" : "No on in room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      <h1>Your Video</h1>
      { myStream && <ReactPlayer playing muted height="100px" width="200px" url={myStream}/>}
    </div>
  )
}

export default Room
