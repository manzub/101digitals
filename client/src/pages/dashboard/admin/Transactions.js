import React from "react"; 
import { connect } from "react-redux"; 
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../../components/ChatWith";
import Notice from "../../../components/Notice";
import { NavLink, useNavigate } from "react-router-dom";
import { CollectionIcon, ServerIcon } from "@heroicons/react/outline";

const allowedRoles = [1];

const Transactions = ({ user }) => {
  const navigate = useNavigate();

  const isAdmin = user.email && allowedRoles.includes(user?.role)

  if(!isAdmin) {
    return(<Notice 
      title="Access Denied" 
      message="You do not have permissions to visit this route"
      cancelClicked={() => navigate('/')}
      actionText='Dismiss'
      actionClicked={() => navigate('/')} />)
  }

  const breadcrumbClassName = "dark:hover:bg-gray-900 dark:bg-gray-800 p-2 hover:bg-gray-600 bg-gray-300 rounded-lg text-gray-400";
  return(<React.Fragment>
    <AdminSidebar>
      {/* transactions & activity log */}
      <div className="my-5 mx-5">
        {/* breadcrumb */}
        <div className="ml-10 mr-0 ">
          <nav className="flex items-center justify-center my-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-3 md:space-x-5">
              <li className="inline-flex items-center">
                <NavLink to="/admin/services" className={"inline-flex items-center text-red-400 "+breadcrumbClassName}>
                  <ServerIcon className="h-6" />
                  {/* active page */}
                  <span className="truncate">Services</span>
                </NavLink>
              </li>
              <li className={"inline-flex items-center "+breadcrumbClassName}>
                <NavLink to="/admin/transactions" className="inline-flex items-center">
                  <CollectionIcon className="h-6" />
                  <span className="truncate">Transactions</span>
                </NavLink>
              </li>
            </ol>
          </nav>
        </div>
        {/* main componnet */}
        <div className="ml-10 mr-0 p-3 shadow-sm rounded-md bg-white dark:bg-gray-800 dark:text-white">
          {/* transactions div */}
          {/* TODO: table list all transactions and actions */}
          {/* TODO: transactions and owners accounts */}
        </div>
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
};
export default connect(state => ({ user: state.user }))(Transactions);