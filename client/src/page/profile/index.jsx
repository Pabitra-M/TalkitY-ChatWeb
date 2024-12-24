import { userAppStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors, getColor } from "@/lib/utils"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ADD_PROFILE_IMAGE_ROUTE, DELETE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants"
import { apiClient } from "@/lib/api-client"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/image/firebash"
import { HOST } from "@/utils/constants"













function Profile() {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = userAppStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if(userInfo.image){
      const imageUrl = `${HOST}/${userInfo.image}`;
    setImage(imageUrl);
    }
  },[userInfo])

  //firebashe

  // const handleFileUpload = async (image) => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + image.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, image);
  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setImagePercent(Math.round(progress));
  //     },
  //     (error) => {
  //       setImageError(true);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
  //         console.log(downloadURL);
  //       }
          
  //       );
  //     }
  //   );
  // };


  const handelNavigate = () => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("Please setup your profile first");
    }
   
  }

















  const validProfile = () => {
    if(!firstName){
      toast.error("First name is required");
      return false;

    }
    if(!lastName){
      toast.error("Last name is required");
      return false;
    }

    console.log(selectedColor, lastName, firstName);
    
    return true;
  }


 const saveChanges = async () => {
   if(validProfile()){
    try {
      const responce = await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName, lastName, color: selectedColor}, {withCredentials: true});
      if(responce.status === 200 && responce.data){
        setUserInfo(responce.data);
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
      console.log(userInfo);
      
    } catch (error) {
      console.log(error);
      
    }
   }

 }

 
 const handleFileInputClick =  () => {
  fileRef.current.click();
 }

 const handleFileChange = async (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const formData = new FormData();
    formData.append("Profile-image", file);
    const responce = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {withCredentials: true});
    console.log("this ",responce);
    
    if(responce.status === 200 && responce.data.image){
 ;
      
      setUserInfo({...userInfo, image: responce.data.image});
    
      toast.success("Profile image updated successfully");
    }
    console.log(userInfo);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    }
    reader.readAsDataURL(file);

  }

}

const handleImageDelete = async() => {
  try {
    const responce = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {withCredentials: true});
    if(responce.status === 200){
    setUserInfo({...userInfo, image: null});
    console.log("thid");
    
      toast.success("Profile image deleted successfully");
      setImage(null);
    }
  } catch (error) {
    console.log(error);
    
  }
}















  
  return (
    <div className=" bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
    <div className=" flex flex-col gap-10 w-[80vw] md:w-max">
      <div className="">
        <IoArrowBack onClick={handelNavigate} className=" text-4xl lg:text-6xl text-white/90 cursor-pointer" />
      </div>
      <div className=" grid grid-cols-2">
      <div className=" h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
        <Avatar className=" w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ">
          {image ? (
            <AvatarImage src={image} alt="profile" className=" object-cover h-full w-full bg-black" />
          ) : (
            <div className={ `uppercase h-32 w-32 md:w-48 md:h-48 flex items-center justify-center text-5xl border-[1px] rounded-full ${getColor(selectedColor)}`}>
              {firstName ? firstName.split("").shift() : userInfo.email.split("").shift()}
            </div>

          )
          }
        </Avatar>
        {
          hovered && (<div onClick={ image ? handleImageDelete : handleFileInputClick}  className=" absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full ">{image ? (<FaTrash className=" text-white text-3xl cursor-pointer" /> ):( <FaPlus className=" text-white text-3xl cursor-pointer" /> )}</div>
        )}


        <input type="file" name="Profile-image" className=" hidden" accept="image/*" ref={fileRef} onChange={handleFileChange} />

      </div>
      <div className=" flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center  ">
        <div className="w-full">
        <Input placeholder="Email"  type="email" value={userInfo.email} disbaled className=" rounded-lg p-6 bg-[#2c2e3d] border-none" />

        </div>

        <div className="w-full">
        <Input placeholder="First Name"  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}  className=" rounded-lg p-6 bg-[#2c2e3d] border-none" />

        </div>


        <div className="w-full">
        <Input placeholder="Last Name"  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className=" rounded-lg p-6 bg-[#2c2e3d] border-none" />

        </div>

        <div className="w-full flex gap-5">
          {
            colors.map((color, index) => (<div key={index} className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${color}  ${selectedColor === index ? "outline outline-white outline-3" : ""}`} onClick={() => setSelectedColor(index)} />))

          }
        </div>
      </div>
      </div>
      <div className="w-full">
        <Button className=" h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 rounded-lg text-xl" onClick={saveChanges} 
        >Save Changes</Button>
      </div>
    </div>
      
    </div>
  )
}

export default Profile