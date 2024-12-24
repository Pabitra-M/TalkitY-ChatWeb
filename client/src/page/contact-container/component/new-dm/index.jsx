import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOption } from "@/lib/utils"
import Lottie from "react-lottie"
import { apiClient } from "@/lib/api-client"
import { SEARCH_CONTACT_ROUTE,HOST } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from '@/lib/utils';
import { userAppStore } from "@/store"

function NewDm() {
    const {selectedChatType, setSelectedChatType,selectedChatData, setSelectedChatData } = userAppStore();
    const [openNewContactModel, setOpenNewContactModel] = useState(false)
    const [searchContact, setSearchContact] = useState([])
    const serchContact = async (serchTerm) => {
        try {
            if (serchTerm.length > 0) {
                const responce = await apiClient.post(SEARCH_CONTACT_ROUTE, { serchTerm }, { withCredentials: true });
                if (responce.status === 200 && responce.data.contact) {
                    setSearchContact(responce.data.contact)

                }
            } else {
                setSearchContact([])
            }
        } catch (error) {
            console.log(error);

        }
    }



    const selectNewContact = async (contact) => {
        setOpenNewContactModel(false)
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchContact([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className=" text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100
                        cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent
                        className=" bg-[#1c1b1e] border-none mb-2 p-3 text-white"
                    >
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>




            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>

                <DialogContent className=" bg-[#181920] border-none text-white flex flex-col w-[400px] h-[400px]">
                    <DialogHeader>
                        <DialogTitle>Please Select a contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Input className=" p-6 rounded-lg bg-[#2c2e3b] border-none"
                            placeholder="Search contacts"
                            onChange={(e) => serchContact(e.target.value)}
                        />
                    </div>
                    {searchContact.length > 0 && (
                    <ScrollArea className=" h-[250px]" >
                        <div className=" flex flex-col gap-5">
                            {
                                searchContact.map((contact) => (
                                    <div className=" flex items-center gap-3 cursor-pointer" key={contact._id} onClick={() => selectNewContact(contact)} >
                                        <div className=' w-12  h-12 relative'>
                                            <Avatar className=" w-12 h-12 rounded-full overflow-hidden ">
                                                {contact.image ? (
                                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className=" object-cover h-full w-full bg-black rounded-full" />
                                                ) : (
                                                    <div
                                                                    className={`uppercase w-12 h-12 flex items-center justify-center text-lg font-bold border-[1px] rounded-full ${getColor(
                                                                      contact.color
                                                                    )}`}
                                                                  >
                                                                    {contact.firstName
                                                                      ? contact.firstName.charAt(0).toUpperCase()
                                                                      : contact.email.charAt(0).toUpperCase()}
                                                                  </div>

                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{
                                                contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                            }</span>
                                            <span className=" text-xs">{contact.email}</span>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>

                    </ScrollArea>

                    )}




                    {searchContact.length <= 0 && (<div className=' flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center mt-5 duration-1000 transition-all'>
                        <Lottie
                            isClickToPauseDisabled={true}
                            height={100}
                            width={100}
                            options={animationDefaultOption}
                        />
                        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-xl text-xl transition-all duration-300 text-center"><h3 className=" poppins-medium">Hi <span className=" text-purple-500">!</span> Search new <span className=" text-purple-500">contact</span>.</h3></div>
                    </div>)
                    }
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDm
