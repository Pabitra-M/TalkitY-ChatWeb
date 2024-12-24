import realLogo from "@/assets/my-logo.png"
import ProfileInfo from "./component/profile-info";
import NewDm from "./component/new-dm";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { userAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChanal from "./component/create-chamel";

function ContactContainer() {
  const {diractMessagesContact,setDiractMessagesContact , channels,setChannels,addChannal } = userAppStore();
  console.log("thisi si proprs ",channels);
  

  useEffect(() => {
    const getContacts = async () => {
      try {
        const responce = await apiClient.get(GET_CONTACTS_FOR_DM_ROUTE, { withCredentials: true });

        if(responce.data.contacts) {
          setDiractMessagesContact(responce.data.contacts);
        }

      } catch (error) {
        console.log(error);
      }
    }
    const getAllChannels = async () => {
      try {
        const responce = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true });

        if(responce.data.channels) {
          setChannels(responce.data.channels);
        }

      } catch (error) {
        console.log(error);
      }
    }

    getContacts();
    getAllChannels();
  }, [setChannels,setDiractMessagesContact])



  return (
    <div className=' relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className=" pt-3">
        <Logo />
      </div>
      <div className=" my-5">
        <div className=" flex items-center justify-between pr-10"> 
          <Title text="Diract massages"/>
          <NewDm />
        </div>
        <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={diractMessagesContact}/>
        </div>
      </div>


      {/* <div className=" my-5">
        <div className=" flex items-center justify-between pr-10"> 
          <Title text="channels"/>
          <CreateChanal />
        </div>
        <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true}/>
        </div>

      </div> */}

      <ProfileInfo />

    </div>
  )
}

export default ContactContainer


const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <img src={realLogo} alt="logo" className=" w-10 h-10" />
      <span className="text-3xl font-semibold berkshire-medium ">TalkitY</span>
    </div>
  );
};

const Title = ({text}) => {
  return (
    <h1 className=" uppercase tracking-widest text-neutral-400 p-4 font-light text-opacity-50 text-sm">{text}</h1>
  )
}