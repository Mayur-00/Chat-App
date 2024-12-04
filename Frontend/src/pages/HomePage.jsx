import React from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import SlideBar from '../components/SlideBar';

const HomePage = () => {
 const {selectedUser} = useChatStore();
  
  return (
    <div className='h-screen bg-base-200'>
        <div className='flex items-center Justify-center pt-20 px-4'>
          <div className='bg-base-100 rounded-lg shadow-xl w-full h-[calc(100vh-8rem)]'>
            <div className='flex h-full rounded-lg overflow-hidden '>
              <SlideBar />

              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

            </div>

            </div> 

        </div>

    </div>
  )
}

export default HomePage