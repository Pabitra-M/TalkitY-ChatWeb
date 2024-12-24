import { userAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "../contact-container";
import EmptyContainer from "../empty-chat-container";
import ChatContainer from "../chat-container";

function Chat() {
  const navigate = useNavigate ();

  const {userInfo, selectedChatType, isUploading,
    isDownloding,
    fileUplodedProgress,
    fileDownlodeProgress} = userAppStore() ;

  
  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please setup your profile first")
      navigate("/profile");
    }
  }, [userInfo, navigate])
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
    {
      isUploading && (<div className=" fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/80 flex items-center justify-center z-10 flex-col gap-5 backdrop-blur-lg">
        <h3 className="text-5xl animate-pulse">Uploading File</h3>
        {fileUplodedProgress}%
      </div>)
    }

    {
      isDownloding && (<div className=" fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/80 flex items-center justify-center z-10 flex-col gap-5 backdrop-blur-lg">
        <h3 className="text-5xl animate-pulse">Downloading File</h3>
        {fileDownlodeProgress}%
      </div>)
    }
     <ContactContainer />
     {
      selectedChatType === undefined ?( <EmptyContainer />) :( <ChatContainer />)
     }
    
     
     
    </div>
  )
}

export default Chat
