import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
    message:[ ],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });

        } catch (error) {

            toast.error(error.response.data.message);
            console.log("error in getUsers function", error);

        }finally{
            set({isUsersLoading:false});
        }

    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/message/${userId}`);
          
          set({ message: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },
    sendMessage: async (messageData) => {
        const { selectedUser, message } = get();
        try {
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
          set({ message: [...(message || []), res.data] });
        } catch (error) {
          toast.error(error.message);
        }
      },
    

    setSelectedUser : async (selectedUser) => set({selectedUser})

}))