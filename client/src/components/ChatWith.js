import React from "react";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { sessionId } from "../helpers/helpers";

const ChatWith = ({ messages }) => {
  const myroomId = sessionId();
  
  return(<React.Fragment>
    <div className='fixed bottom-0 right-0'>
      <NavLink to="/chatwith" className='float-right mb-3 mr-3'>
        <span className="relative inline-block mx-3">
          <ChatAlt2Icon className="h-[50px] px-2 shadow-md py-2 bg-red-400 text-white text-sm font-bold tracking-wide rounded-full focus:outline-none" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-blue-400 rounded-full">{messages[myroomId]?.length || messages?.length}</span>
        </span>
      </NavLink>
    </div>
  </React.Fragment>)
}

export default connect(state => state.app)(ChatWith);