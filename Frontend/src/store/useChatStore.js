import { create,  } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  message: [],
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

    } finally {
      set({ isUsersLoading: false });
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

  subscribeMessages: () => {

    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    console.log(socket);

    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    };
    socket.off("newMessage");
    
    socket.on("newMessage", (newMessage) => {
      if(newMessage.sender.userId !==selectedUser._id) return;

      set({ message: [...(get().message || []), newMessage] });

    })
  },

  unsubscribeMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }
    
    socket.off("newMessage")
  },


  setSelectedUser: async (selectedUser) => set({ selectedUser })

}))
