import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=> ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,
    checkAuth: async () => {  
       try {
         const res = await axiosInstance.get("/auth/check");
         set({authUser:res.data});
       } catch (error) {
         console.log(`error in checkAuth: ${error}`);
         set({authUser:null});
    
       } finally{
        set({isCheckingAuth:false})
       }

    },
    signUp: async (data) => {
      set({isSigningUp:true});
      try {
        console.log(data);
        

      const res =  await axiosInstance.post("/auth/signup",data)
      console.log(res);
      
      set({authUser:res.data});
      toast.success("Account Created Succesfully !")

        
      } catch (error) {
        toast.error(error)
        console.log(error);
        
        
      }
      finally{
        set({isSigningUp:false});
      }
      
    },
    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null})
        toast.success("logged Out Successfully !")
        
      } catch (error) {
        toast.error(error.response.data.message);
        console.log("error in logout function");
        
        
      }
    },
    login: async (data) => {
      set({isLoggingIn:true});
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({authUser:res.data})
        toast.success("Loggedin Successfully !")
        
      } catch (error) {
        toast.error(error.response.data.message)
        console.log("error in login function " + error)
      }finally{
        set({isLoggingIn:false})
      }

    }
   
}));