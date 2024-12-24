import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { userAppStore } from '@/store';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { Socket } from 'socket.io-client';

import { UPLODE_FILE_ROUTE } from '@/utils/constants';



function MassageBar() {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const [message, setMessage] = useState('')
    const [emojiPikerOpen, setEmojiPikerOpen] = useState(false)
    const { selectedChatType, selectedChatData, userInfo, setIsUploading, isDownloding, fileUplodedProgress, fileDownlodeProgress, setFileUplodedProgress} = userAppStore();
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPikerOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[emojiRef]);



    const handleEmojiClick = (emoji) => {
        setMessage((prevMessage) => prevMessage + emoji.emoji);
    }
    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            content:message,
            massageType:"text",
            fileUrl: undefined
          });
            
        }else if(selectedChatType === "channel"){
            socket.emit("send-channel-message", {
            sender: userInfo.id,
            content:message,
            massageType:"text",
            fileUrl: undefined,
            channelId: selectedChatData._id
          });
        }

        setMessage('');
    }

    const handelAttachmentClick = () => {
      if(fileInputRef.current){
        fileInputRef.current.click();
      }
    }


    const handelAttachmentChange = async (event) => {
      try {
        const file = event.target.files[0];
        if(file){
          const formData = new FormData();
          formData.append("file", file);
          setIsUploading(true);
          const responce = await apiClient.post(UPLODE_FILE_ROUTE, formData, {withCredentials: true,
            onUploadProgress: ( data )=> {
              setFileUplodedProgress(Math.round((data.loaded  * 100 ) / data.total));
            }
          });
          if(responce.status === 200 && responce.data){
            setIsUploading(false);
            if(selectedChatType === "contact"){
              socket.emit("sendMessage", {
                sender: userInfo.id,
                recipient: selectedChatData._id,
                content:undefined,
                massageType:"file",
                fileUrl: responce.data.filePath
            
              })
            }else if(selectedChatType === "channel"){
              socket.emit("send-channel-message", {
                sender: userInfo.id,
                content:undefined,
                massageType:"file",
                fileUrl: responce.data.filePath,
                channelId: selectedChatData._id
              });
            }
            
          }
        }

      }catch(error){
        setIsUploading(false);
        console.log(error);
        
      }
    }







  return (
    <div className=' h-[10vh] bg-[#1c1b25] flex items-center justify-center px-8 mb-6 gap-6'>
     <div className=' flex-1 flex rounded-md items-center gap-5 pr-5 bg-[#2a2b33]'>
     <input type="text" className=' flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
     placeholder='Enter Message'
     value={message}
     onChange={(e) => setMessage(e.target.value)}
      />
      <button className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handelAttachmentClick}>
        <GrAttachment  className=' text-2xl' />
      </button>

      <input type="file" ref={fileInputRef} className=' hidden' onChange={handelAttachmentChange} />







      <div className=" relative">
      <button className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      onClick={() => setEmojiPikerOpen(!emojiPikerOpen)}
      >
      <RiEmojiStickerLine className=' text-2xl' />
      </button>
      <div className=" absolute bottom-12 right-0" ref={emojiRef}>
        <EmojiPicker theme='dark' open={emojiPikerOpen} onEmojiClick={handleEmojiClick} autoFocusSearch={false} />
      </div>
      </div>

     </div>






     <button className=" p-5  bg-[#8417ff] focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:bg-[#741bda] focus:bg-[#741bda] rounded-md"
     onClick={handleSendMessage}
     >
        <IoSend className=' text-2xl' />
      </button>
    </div>
  )
}

export default MassageBar
