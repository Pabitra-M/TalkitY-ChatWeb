import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { userAppStore } from '@/store'
import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';
function ChatHeader() {

  const { closeChat, selectedChatData, selectedChatType } = userAppStore();
  return (
    <div className=' h-[10vh] border-b-2 border-[#2f303d] flex items-center justify-center'>
      <div className="flex gap-5 items-center w-full justify-between p-7">
        <div className=' flex gap-3 items-center justify-center'>
          <div className=' w-12  h-12 relative'>

          {
            selectedChatType === "contact" ? ( <Avatar className=" w-12 h-12 rounded-full overflow-hidden ">
              {selectedChatData.image ? (
                <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className=" object-cover h-full w-full bg-black" />
              ) : (
                <div
                className={`uppercase w-12 h-12 flex items-center justify-center text-lg font-bold text-white border-[1px] rounded-full ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.charAt(0).toUpperCase()
                  : selectedChatData.email.charAt(0).toUpperCase()}
              </div>

              )}
            </Avatar>) : (<div className=' h-10 w-10 rounded-full flex items-center justify-center bg-[#ffffff22]'>#</div>)
          }
           
          </div>
          <div >
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
          </div>
        </div>
        <div className=' flex gap-5 items-center justify-center'>
          <button className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={closeChat}>
            <RiCloseFill className=' text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
