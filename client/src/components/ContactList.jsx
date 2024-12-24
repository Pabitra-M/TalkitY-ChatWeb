import { userAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

function ContactList({ contacts, isChannel = false }) {
    const { selectedChatType, selectedChatData, setSelectedChatType, setSelectedChatData,
        setSelectedChatMassage,
    } = userAppStore();
    console.log("this is contact",contacts);
    
    const handelClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) setSelectedChatMassage([]);
    }
    return (
        <div className=' mt-5'>
            {contacts.map((contact) => (
                <div key={contact._id} className={`pl-10 py-2 transition-all duration-200 curser-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]/90" : "hover:bg-[#f1f1f111]"}`}
                    onClick={() => handelClick(contact)}
                >
                    <div className=" flex items-center gap-5 justify-start text-neutral-300">
                        {
                            !isChannel && (<Avatar className=" w-10 h-10 rounded-full overflow-hidden ">
                                {contact.image ? (
                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className=" object-cover h-full w-full bg-black" />
                                ) : (
                                    <div
                                        className={`${ selectedChatData && selectedChatData._id === contact._id ? " bg-[#ffffff22]/50 border border-white/50 " : getColor(contact.color)}
                                        }
                                        uppercase h-10 w-10 flex items-center justify-center text-lg text-white border-[1px] rounded-full`}
                                    >
                                        {contact.firstName ? contact.firstName.charAt(0).toUpperCase() : contact.email.charAt(0).toUpperCase()}
                                    </div>

                                )}
                            </Avatar>
            )}
            {
                isChannel && ( <div className=' h-10 w-10 rounded-full flex items-center justify-center bg-[#ffffff22]'>#</div>)
            }
            {
                isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
            }
            </div>

                </div>
            )
            )}
        </div>
    )
}

export default ContactList
