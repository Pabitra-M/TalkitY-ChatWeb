import { userAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useEffect, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";



const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const {userInfo,  } = userAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST,{
                withCredentials: true,
                query: {
                    userId: userInfo.id
                }
            }); 

            socket.current.on("connect", () => {
                console.log("socket connected");
            });

            const handelReciveMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage} = userAppStore.getState();
                
                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){ 

                    console.log("mass rec:", message);
                    
                    addMessage(message);

                }
            
            }

            const handelReciveChannelMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage} = userAppStore.getState();
                
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId){ 
                    console.log("mass rec:", message);
                    console.log(message);
                    
                    addMessage(message);

                }
            
            }


            socket.current.on("reciveMessage", handelReciveMessage);

            socket.current.on("recive-channel-message", handelReciveChannelMessage);

            return () => {
                socket.current.disconnect();
            }


        } 
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}