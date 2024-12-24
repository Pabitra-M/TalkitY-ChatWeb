export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMassage: [],
    diractMessagesContact: [],
    isUploading: false,
    isDownloding: false,
    fileUplodedProgress: 0,
    fileDownlodeProgress: 0,
    channels : [],
    setChannels : (channels) => set({channels}),
    setIsUploading: (isUploading) => set({isUploading}),
    setIsDownloding: (isDownloding) => set({isDownloding}),
    setFileUplodedProgress: (fileUplodedProgress) => set({fileUplodedProgress}),
    setFileDownlodeProgress: (fileDownlodeProgress) => set({fileDownlodeProgress}),
    setSelectedChatType: (selectedChatType) => set({selectedChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedChatMassage: (selectedChatMassage) => set({selectedChatMassage}),
    setDiractMessagesContact: (diractMessagesContact) => set({diractMessagesContact}),
    addChannal: (channel) => {
        const channels = get().channels;
        set({channels: [channel,...channels]})
    },
    
    closeChat: () => set({selectedChatType: undefined,selectedChatData: undefined, selectedChatMassage: []}),

    addMessage : (message) =>{
        const selectedChatMassage = get().selectedChatMassage;

        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMassage: [...selectedChatMassage, {...message, recipient: 
                selectedChatType === " channel" ? message.recipient : message.recipient._id ,

            sender: 
                selectedChatType === " channel" ? message.sender : message.sender._id 
            }],
        })
        
    }


})