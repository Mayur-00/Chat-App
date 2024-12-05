import React from "react";
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { message, getMessages, isMessagesLoading, selectedUser, subscribeMessages, unsubscribeMessages } = useChatStore();
  const {authUser} = useAuthStore();

 const messageEndRef = useRef(null)


  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeMessages();

    
  }, [selectedUser._id, getMessages, subscribeMessages, ]);  

  useEffect(()=>{
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }  }, [message])
  

  if (isMessagesLoading)  
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1  overflow-y-auto p-4 space-y-4  ">
        {Array.isArray(message) && message.map((elem, idx)=> (
          <div key={idx}
          className={`chat ${elem.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          ref={messageEndRef}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border" >

                <img
                 src={elem.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png" }
                  alt="profile pic" 
                  />
              </div>
            </div>
            <div className="chat-header  mb-1 ">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(elem.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col ">
              {elem.images && (
                <img
                 src={elem.images}
                 alt="Attachment"
                 className="sm:max-w-[200px] rounded-md mb-2"
                />

              )}
              {elem.text && <p>{elem.text}</p>}
            </div>
          </div>
        ))}

      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
