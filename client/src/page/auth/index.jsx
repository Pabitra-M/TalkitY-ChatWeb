import { Tabs, TabsList } from "@/components/ui/tabs"
import Background from "../../assets/login2.png"
import Victory from "../../assets/victory.svg"
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RiEyeCloseLine } from "react-icons/ri";
import { HiOutlineEye } from "react-icons/hi";
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
import { userAppStore } from "@/store"


function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUserInfo } = userAppStore();
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confShow, setConfShow] = useState(false)
  const [show, setShow] = useState(false)

  const validateSignup = () => {
    if(!email.length){
    toast.error("Email is required");
    return false;
    }
    if(!password.length){
      toast.error("password is required");
      return false;
    }
    if(!confirmPassword.length){
      toast.error("confirm your Password");
      return false;
    }
    if(password !== confirmPassword){
      toast.error("password is not Match");
      return false;
    }
    return true;
  }

  const validateLogin = () => {
    if(!email.length){
      toast.error("Email is required");
      return false;
      }
      if(!password.length){
        toast.error("password is required");
        return false;
      }
      return true;
  }










// this is backend connection
  const handleLogin = async () => { 
    if(validateLogin()){
      const responce = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
      if(responce.data.user.id){
        setUserInfo(responce.data.user)
        if(responce.data.user.profileSetup){
          navigate("/chat");
        }else{
          navigate("/profile")
        }
      }
      console.log(responce);
    }
  }

  const handleSignup = async () => { 
    if (validateSignup()){
      const responce  = await apiClient.post(SIGNUP_ROUTE,{email, password},{withCredentials: true })
      if(responce.status === 201){
        setUserInfo(responce.data.user)
        navigate("/profile");
      }
      console.log(responce);
      
    }

  }




  // main 


  return (
    <div className=" h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-500">
      <div className="h-[85vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw]  lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center h-[85vh] ">
          <div className=" flex flex-col justify-center items-center">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="victory emoji" className=" h-[100px]" />
            </div>
            <p className=" font-medium text-center">Fill in the details to get started with the best chat app!</p>
          </div>
          <div className="flex item-center justify-center w-full">
            <Tabs className=" w-3/4" defaultValue="login">
              <TabsList className=" bg-transparent rounded-none w-full">
                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">signin</TabsTrigger>
                <TabsTrigger value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">signup</TabsTrigger>
              </TabsList>
              <TabsContent className=" flex flex-col gap-5 mt-10" value="login">
                <Input placeholder="Email" type="email" className=" rounded-full p-6" value={email} onChange={e => setEmail(e.target.value)} />




                <div className=" flex">

                  <Input placeholder="Password" type={!show ? "password" : "text"} className=" rounded-l-full border-r-0  p-6" value={password} onChange={e => setPassword(e.target.value)} />

                  <button className="border-2 border-l-0  rounded-r-full p-4" onClick={() => setShow(!show)}>
                    {!show ? <RiEyeCloseLine /> : <HiOutlineEye />}
                  </button>
                </div>

                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>





              </TabsContent>
              <TabsContent className=" flex flex-col gap-5 " value="signup">
                <Input placeholder="Email" type="email" className=" rounded-full p-6" value={email} onChange={e => setEmail(e.target.value)} />


                <div className=" flex">

                  <Input placeholder="Password" type={!show ? "password" : "text"} className=" rounded-l-full border-r-0  p-6" value={password} onChange={e => setPassword(e.target.value)} />

                  <button className="border-2 border-l-0  rounded-r-full p-4" onClick={() => setShow(!show)}>
                    {!show ? <RiEyeCloseLine /> : <HiOutlineEye />}
                  </button>
                </div>

                <div className=" flex">
                  <Input placeholder="Confirm Password" type={!confShow ? "password" : "text"} className=" rounded-l-full border-r-0  p-6" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                  <button className="border-2 border-l-0  rounded-r-full p-4" onClick={() => setConfShow(!confShow)}>
                    {!confShow ? <RiEyeCloseLine /> : <HiOutlineEye />}
                  </button>
                </div>




               


                <Button className="rounded-full p-6" onClick={handleSignup}>signup</Button>
              </TabsContent>
            </Tabs>

          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="backgroung" className="h-[600px]" />
        </div>
      </div>
    </div>
  )
}

export default Auth
