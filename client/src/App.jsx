import React, { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Auth from './page/auth'
import Profile from './page/profile'
import Chat from './page/chat'
import { userAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
import { use } from 'react'


const PrivateRoute = ({children}) => {
  const {userInfo} = userAppStore();
  const isAuthenticated = !!userInfo ;
  return isAuthenticated ? children : <Navigate to = '/auth'/>

}



const AuthRoute = ({children}) => {
  const {userInfo} = userAppStore();
  const isAuthenticated = !!userInfo ;
  // console.log(isAuthenticated);
  
  return isAuthenticated ? <Navigate to = "/chat"/> : children
  
}






const App = () => {

  
  const {userInfo, setUserInfo} = userAppStore();
  const [loding, setLoding] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        
        const responce = await apiClient.get(GET_USER_INFO, {withCredentials: true});
        console.log(responce);
        if(responce.status === 200 && responce.data.id){
        
        
        setUserInfo(responce.data);
        console.log(responce.data);
        
       }else{
        setUserInfo(undefined)
       }
       console.log(responce);
        

      } catch (error) {
        console.log(error);
        setUserInfo(undefined)
        
      } finally{
        setLoding(false);
      }
    }




    if(!userInfo){
        getUserData();
      }else{
        setLoding(false);
        
      }

      
  },[userInfo, setUserInfo])



    if(loding){
      return (
        <div className='flex justify-center items-center h-screen'> Loading.....
          </div>
      )
  }











  return (
   <BrowserRouter>
   <Routes>
   <Route path='*' element={<Auth/>} />
    <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>} />
    <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
    <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>} />
    
   </Routes>  
    </BrowserRouter>
  )
}

export default App
