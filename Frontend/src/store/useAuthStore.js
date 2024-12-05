import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log(`error in checkAuth: ${error}`);
      set({ authUser: null });

    } finally {
      set({ isCheckingAuth: false })
    }

  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log(data);


      const res = await axiosInstance.post("/auth/signup", data);
      console.log(res);

      set({ authUser: res.data });
      toast.success("Account Created Succesfully !");
      get().connectSocket();


    } catch (error) {
      toast.error(error);
      console.log(error);


    }
    finally {
      set({ isSigningUp: false });
    }

  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disConnectSocket();
      set({ authUser: null, socket:null })
      toast.success("logged Out Successfully !")

    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error in logout function");


    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data })
      toast.success("Loggedin Successfully !")
      get().connectSocket()

    } catch (error) {
      toast.error(error.message)
      console.log("error in login function " + error)
    } finally {
      set({ isLoggingIn: false })
    }

  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/profile-update", data);
      set({ authUser: res.data })
      toast.success("Profile Picture Updated SuccessFully")
    } catch (error) {
      toast.error(error.messsage);
      console.log("error in update profile function :" + error);


    }
    finally {
      set({ isUpdatingProfile: false })
    }

  },

  connectSocket: () => {
    const { authUser } = get()

    if (!authUser || get().socket?.connected) return;


    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })





  },
  disConnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();

  },


}));