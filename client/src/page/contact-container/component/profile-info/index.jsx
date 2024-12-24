import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { userAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { getColor } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import { apiClient } from '@/lib/api-client';

function ProfileInfo() {
    const navigate = useNavigate();

    const { userInfo, setUserInfo } = userAppStore();

    const handelLogout = async () => {
        try {
            const responce = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if (responce.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (error) {
            console.log(error);

        }
    }

    console.log("this is user info", userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift());



    return (
        <div className=' absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
            <div className="flex gap-3 items-center justify-center">
                <div className=' w-12  h-12 relative'>
                    <Avatar className=" w-12 h-12 rounded-full overflow-hidden ">
                        {userInfo.image ? (
                            <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className=" object-cover h-full w-full bg-black rounded-full" />
                        ) : (
                            <div
                                className={`uppercase w-12 h-12 flex items-center justify-center text-lg font-bold text-white border-[1px] rounded-full ${getColor(
                                    userInfo.color
                                )}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0).toUpperCase()
                                    : userInfo.email.charAt(0).toUpperCase()}
                            </div>
                        )
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger > <FiEdit onClick={() => navigate("/profile")} className=' text-purple-500 text-xl font-medium' /> </TooltipTrigger>
                        <TooltipContent className=' bg-[#1c1b1e] text-white
                        border-none'>
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>



                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger > <IoPowerSharp onClick={handelLogout} className=' text-red-500 text-xl font-medium' /> </TooltipTrigger>
                        <TooltipContent className=' bg-[#1c1b1e] text-white
                        border-none'>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo
