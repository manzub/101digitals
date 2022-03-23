import React from "react"; 
import { useSelector } from "react-redux"; 
import { ArrowCircleRightIcon, UserCircleIcon } from "@heroicons/react/solid";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../components/ChatWith";
import Notice from "../../components/Notice";
import { useNavigate } from "react-router-dom";

// TODO: admin dashboard
const allowedRoles = [1, 2, 3]
const Dashboard = () => {
  const { user } = useSelector(state => state);
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

  return(<React.Fragment>
    <AdminSidebar>
      {/* transactions & activity log */}
      <div className="my-5 mx-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="shadow-sm rounded-md bg-white dark:bg-gray-800 py-2 px-3">
            <h3 className="dark:text-white">Transactions Preview ({user?.transactions.length})</h3>
            <hr />
            <div className="my-3 min-h-[300px]">
              <div className="px-5 py-2">
                { user?.transactions.map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <ArrowCircleRightIcon className="h-[35px] text-blue-400" />
                    <div className="block">
                      <h2 className="dark:text-white">{ item.type === 'trade' ? 'Transfered' : '' } <strong>${item.amountValue}</strong></h2>
                      <p style={{fontSize:10}} className='text-gray-400'>{item.service.name}</p>
                      <small>status: <label className={item.status === 'completed' ? 'bg-success' : 'bg-yellow-400'}>{item.status}</label></small>
                    </div>
                  </div>
                )) }
              </div>
            </div>
          </div> 

          {/* TODO: activity log */}
          <div className="shadow-sm rounded-md bg-white dark:bg-gray-800 py-2 px-3">
            <h3 className="dark:text-white">Activity Log (10)</h3>
            <hr/>
            <div className="my-3 min-h-[300px]">
              <div className="px-5 py-2">
                <div className="flex items-center justify-between">
                  <UserCircleIcon className="h-[35px] text-blue-400" />
                  <div className="block">
                    <h2 className="truncate dark:text-white" style={{fontSize:15}}>Updated Bank Information</h2>
                    <p style={{fontSize:10}} className='text-gray-400'>Bitcoin $100 single</p>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
};
export default Dashboard;