import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
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
import { SEARCH_CONTACT_ROUTE, HOST, CREATE_CHANNEL_ROUTE } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from '@/lib/utils';
import { userAppStore } from "@/store"
import { use } from "react"

import { GET_ALL_CONTACTS } from "@/utils/constants";
import { Button } from "@/components/ui/button"
import MultipleSelector from "@/components/ui/multipleselect"

function CreateChanal() {
    const { selectedChatType, setSelectedChatType, selectedChatData, setSelectedChatData, addChannal } = userAppStore();
    const [newChanalModel, setNewChanalModel] = useState(false)
    const [searchContact, setSearchContact] = useState([])
    const [allContacts, setAllContacts] = useState([])
    const [selecttedContact, setSelecttedContact] = useState([])
    const [chanalName, setChanalName] = useState("")


    useEffect(() => {
        const getData = async () => {
            try {
                const responce = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true });
                if (responce.status === 200 && responce.data.contacts) {
                    setAllContacts(responce.data.contacts)

                }
            } catch (error) {
                console.log(error);

            }
        }

        getData();
       

    }, [])


    const defaultOption = allContacts.map((contact) => ({
        label: contact.lable,
        value: contact.value,
      }));





    const createNewChannal = async () => {
            try {
                if( chanalName.length > 0 && selecttedContact.length > 0) {

                
                const responce = await apiClient.post(CREATE_CHANNEL_ROUTE, { name: chanalName, members: selecttedContact.map((contact) => contact.value) }, { withCredentials: true });
                if (responce.status === 201) {
                    setChanalName("");
                    setSelecttedContact([]);
                    addChannal(responce.data.Channel);
                    setNewChanalModel(false);
                }
            }
            } catch (error) {
                console.log(error);
                
            }

     }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className=" text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100
                        cursor-pointer transition-all duration-300" onClick={() => setNewChanalModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent
                        className=" bg-[#1c1b1e] border-none mb-2 p-3 text-white"
                    >
                        Create New Channal
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>




            <Dialog open={newChanalModel} onOpenChange={setNewChanalModel}>

                <DialogContent className=" bg-[#181920] border-none text-white flex flex-col w-[400px] h-[400px]">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new Channal</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Input className=" p-6 rounded-lg bg-[#2c2e3b] border-none"
                            placeholder="Channal Name"
                            onChange={(e) => setChanalName(e.target.value)}
                            value={chanalName}
                        />
                    </div>
                    <div>
                        <MultipleSelector className=" rounded-lg  bg-[#2c2e3b] border-none py-2 text-white"

                            defaultOptions={defaultOption}
                            value={selecttedContact}
                            onChange={setSelecttedContact}
                            placeholder="Select contact"
                            emptyIndicator={
                                <p className=" text-center text-lg leading-10 text-gray-600">No contact found</p>
                            }
                        />
                    </div>
                    <div>
                        <Button onClick={createNewChannal} className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 ">
                            Create Channel
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>


        </>
    )
}

export default CreateChanal
