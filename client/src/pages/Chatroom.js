import { ArrowLeftIcon, UserCircleIcon, XIcon } from "@heroicons/react/outline";
import React, { useCallback, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { sessionId } from "../helpers/helpers";
import useToken from "../hooks/useToken";
import initialState from "../redux/initialState";
import backendApi from "../utils/backendApi";

const adminRoles = { superAdmin: 1, attendant: 2, customer: 3 };

const Chatroom = ({ user, messages, socket }) => {
  const isLoggedIn = !!(user?.email && [1, 2].includes(user?.role));

  const { token, clearToken } = useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [chatroom, selectChatroom] = useState(null);
  const [rooms, updateRooms] = useState(null);
  const myroomId = sessionId();

  const [message, updateMessage] = useState('');

  const getRooms = useCallback(() => {
    backendApi.getChatrooms(token).then(response => {
      if(response.status === 2) {
        clearToken();
        dispatch({ type: 'SIGNIN', payload: initialState.user })
      } else if(response.status === 1) {
        updateRooms(response.rooms);
      }
    })
  },  [token, clearToken, dispatch])

  useEffect(() => {
    if(isLoggedIn && !chatroom && !rooms) {
      getRooms();
    }
  }, [isLoggedIn, chatroom, rooms, getRooms])

  const sendMessage = () => {
    let chatroomId = chatroom || myroomId
    socket?.emit('send-message', {chatroom: chatroomId, sender: isLoggedIn && chatroom ? { email: user?.email, role: user?.role } : myroomId, message: message});
    updateMessage("");
  }

  const connectRoom = (roomId) => {
    socket?.emit('room-messages', roomId);
    selectChatroom(roomId);
  }

  return(<React.Fragment>
    <div className={"h-screen dark:text-white" + (isLoggedIn && !chatroom ? null : 'flex-1 justify-between flex flex-col')}>
      <header className="header bg-white dark:bg-gray-700 shadow py-4 px-4">
        <div className="header-content flex items-center flex-row">
          <div onClick={() => navigate(-1)} className="">
            {/* back action */}
            <span className="cursor-pointer flex flex-row items-center">
              <ArrowLeftIcon className="h-[35px] text-gray-600 dark:text-white" />
              <span className="sr-only">Go back</span>
            </span>
          </div>
          
          <div className="flex ml-auto">
          <div className="">
              { chatroom ? <span onClick={() => selectChatroom(null)} className="flex flex-row items-center">
                Chating With: <XIcon className="cursor-pointer h-[35px] text-gray-600 dark:text-white" />
              </span> : null}
            </div>
            <div className="">
              {/* change action */}
              <NavLink to="/profile" className="flex flex-row items-center">
                <UserCircleIcon className="h-[35px] text-gray-600 dark:text-white" />
                <span className="flex flex-col ml-2">
                  <span className="truncate w-20 font-semibold dark:text-white tracking-wide leading-none">{user?.fullname || 'Anonymous'}</span>
                  {/* TODO: add user role */}
                  <span className="truncate w-20 text-gray-500 dark:text-white text-xs leading-none mt-1">{Object.keys(adminRoles)[Object.values(adminRoles).indexOf(user?.role)] || 'Guest'}</span>
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      { isLoggedIn && !chatroom ? <React.Fragment>
        <div className="mt-5 flex items-center justify-center dark:text-white">
          <div className="p-5 shadow-md dark:bg-gray-800 rounded-md">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Select a customer to chat with</h2>
              <span onClick={getRooms} className="ml-5 text-red-200 hover:text-red-400 cursor-pointer">Refresh</span>
            </div>
            <hr/>
            {rooms && rooms.length > 0 ? rooms?.map((item, idx) => (<div key={idx}>
              <h3 onClick={() => connectRoom(item)} className="hover:bg-red-100 p-4 hover:text-gray-700 cursor-pointer">Customer No. {idx + 1}</h3>
            </div>)) : <h2>No available customers to chat with</h2>}
          </div>
        </div>
      </React.Fragment> : <React.Fragment>
        <div id="messages" className="m-3 flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          { messages?.map((item, idx) => {
            const isSender = isLoggedIn ? item.sender.email === user.email : item.sender === myroomId;
            return (<div key={idx} className="chat-message">
              <div className={"flex items-end " + (!isSender ? 'justify-end' : null)}>
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>{item.body.map((content, idx) => {
                    return (<div key={idx} className='my-1'>
                      <span className={"px-4 py-2 rounded-lg inline-block rounded-bl-none " + (!isSender ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-600')}>{content}</span>
                    </div>)
                  })}</div>
                </div>
                <span>{isSender ? 'You' : (item.sender.role === 2 ? 'Admin' : 'C.S')}</span>
              </div>
            </div>)
          }) }
          
        </div>

        <div className="border-t-2 border-gray-800 px-4 py-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input 
              type="text" 
              value={message}
              onChange={(event) => updateMessage(event.target.value)}
              placeholder="Write your message!" 
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
            <div className="absolute right-0 items-center inset-y-0 flex">
                <button onClick={sendMessage} type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-red-400 hover:bg-red-600 focus:outline-none">
                  <span className="font-bold">Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
            </div>
          </div>
        </div>
      </React.Fragment> }
    </div>
  </React.Fragment>)
}

export default connect((state) => ({ user: state.user, messages: state.app.messages, socket: state.app.socket }))(Chatroom);