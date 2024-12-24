import { apiClient } from '@/lib/api-client';
import { userAppStore } from '@/store';
import { GET_MESSAGE_ROUTE, HOST } from '@/utils/constants';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5';
function MassageContainer() {
  const scrollRef = useRef();
  const containerRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMassage, setSelectedChatMassage, fileDownlodeProgress, setFileDownlodeProgress, setIsDownloding } = userAppStore();
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_MESSAGE_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        if (response.data.messages) {
          setSelectedChatMassage(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === 'contact') {
        getMessages();
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMassage]);

  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMassage, isAutoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Check if the user is near the bottom of the container
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setIsAutoScroll(isAtBottom);
    }
  };



  const chackImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff|tif|heic|heif)$/i;
    return imageRegex.test(filePath);
  }






  const doewnlodeFile = async (url) => {

    setIsDownloding(true);
    setFileDownlodeProgress(0);
    const responce = await apiClient.get(`${HOST}/${url}`, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor((loaded * 100) / total);
        setFileDownlodeProgress(percentage);
      }
    });
    const uelBolb = URL.createObjectURL(responce.data);
    const link = document.createElement('a');
    link.href = uelBolb;
    link.setAttribute('download', url.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(uelBolb);
    setIsDownloding(false);
    setFileDownlodeProgress(0);

  }

  const renderMessages = () => {
    let lastDate = null;
    console.log("yes",selectedChatMassage);
    

    return selectedChatMassage.map((message, index) => {
      const messageDate = moment(message.timeStamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;


      return (
        <div key={index}>
          {showDate && (
            <div className="text-gray-500 text-center my-4">
              {moment(message.timeStamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'contact' && renderDmMessages(message)}
          {selectedChatType === 'channel' && renderChannelMessages(message) }
        </div>
      );
    });

  };

  const renderDmMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? 'text-left' : 'text-right'}`}>
      {message.massageType === 'text' && (
        <div
          className={`${message.sender !== selectedChatData._id
            ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
            : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
            } border inline-block p-2 rounded-lg my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}


      {
        message.massageType === 'file' && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
              } border inline-block p-2 rounded-lg my-1 max-w-[50%] break-words`}
          >

            {chackImage(message.fileUrl) ? (<div className=' cursor-pointer'
              onClick={() => {
                setShowImage(true)
                setImageUrl(message.fileUrl)
              }
              }
            > <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="file" /> </div>) : (<div className='  flex items-center justify-center gap-4'>
              <span className=' p-3 rounded-full text-white/8 text-3xl bg-black/20'>
                <MdFolderZip />

              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className=' bg-black/20 p-3 rounded-full hover:bg-black/50 text-2xl cursor-pointer transition-all duration-300'
                onClick={() => doewnlodeFile(message.fileUrl)}
              ><IoMdArrowRoundDown /></span>

            </div>)}
          </div>
        )
      }






      <div className="text-xs text-gray-600">{moment(message.timeStamp).format('LT')}</div>
    </div>
  );




  const renderChannelMessages = (message) => {
    console.log("this is channel message", message);
    
    return (
      <div className={`${message.sender_id !== userInfo._id ? 'text-left' : 'text-right'}`}>

        {message.massageType === 'text' && (
          <div
            className={`${message.sender_id !== userInfo._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
              } border inline-block p-2 rounded-lg my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
      </div>
    )
  }
  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hide p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && <div className='fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/50 z-[1000] flex items-center justify-center backdrop-blur-lg flex-col'>
        <div>
          <img src={`${HOST}/${imageUrl}`} className=' w-[100vh] h-full bg-cover' />
        </div>
        <div className=' flex fixed gap-5 mt-5 top-0'>
          <button className=' bg-black/20 p-3 rounded-full hover:bg-black/50 text-2xl cursor-pointer transition-all duration-300' onClick={() => doewnlodeFile(imageUrl)}>
            <IoMdArrowRoundDown />
          </button>

          <button className=' bg-black/20 p-3 rounded-full hover:bg-black/50 text-2xl cursor-pointer transition-all duration-300' onClick={() => {
            setShowImage(false)
            setImageUrl(null)
          }}>
            <IoCloseSharp />
          </button>

        </div>

      </div>}
    </div>
  );
}

export default MassageContainer;
