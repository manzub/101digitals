import React, { useState } from "react"; 
import { connect, useDispatch } from "react-redux"; 
import { useMutation, useQueryClient } from "react-query"; 
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../components/ChatWith";
import Notice from "../../components/Notice";
import { NavLink, useNavigate } from "react-router-dom";
import { CashIcon, LockClosedIcon, UserIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import backendApi from "../../utils/backendApi";
import useToken from "../../hooks/useToken";

const allowedRoles = [1, 2, 3]
const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearToken } = useToken();
  const queryClient = useQueryClient();

  const defaultForm = { email:user?.email || '', fullname: user?.fullname || '', phone: user?.phone || '', password: null };
  const [form, updateForm] = useState(defaultForm);

  const [isUpdated, setMutationState] = useState(false);
  const [changeEmail, proceedChange] = useState(false);

  const isAdmin = user.email && allowedRoles.includes(user?.role)

  const profileMutation = useMutation(postData => {
    if(!(postData.email && postData.fullname && postData.phone && postData.password)) throw new Error('fill in all fields');
    return backendApi.updateUserProfile(postData, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setMutationState(true);
      queryClient.invalidateQueries('user-token');
      clearToken();
      dispatch({ type: 'SIGNIN', payload: { status: 0 } })
      alert('Email edited, signin again to continue');
    } else throw new Error(data.message);
  } })

  const proccessSubmit = () => {
    window.scrollTo(0, 0);
    if(form.email === user?.email) {
      profileMutation.mutate(form)
    } else proceedChange(true);
  }

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
      <div className="my-5 mx-5">
        {/* breadcrumb */}
        <div className="ml-10 mr-0 ">
          <nav className="flex items-center justify-center my-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-3 md:space-x-5">
              <li className="inline-flex items-center">
                <NavLink to="/dashboard/profile" className={"inline-flex items-center text-red-400 "+breadcrumbClassName}>
                  <UserIcon className="h-6" />
                  {/* active page */}
                  <span className="truncate">Edit Profile</span>
                </NavLink>
              </li>
              <li className={"inline-flex items-center "+breadcrumbClassName}>
                <NavLink to="/dashboard/bank-info" className="inline-flex items-center">
                  <CashIcon className="h-6" />
                  <span className="truncate">Bank Info</span>
                </NavLink>
              </li>
              <li className={"inline-flex items-center "+breadcrumbClassName}>
                <NavLink to="/dashboard/security" className="inline-flex items-center">
                  <LockClosedIcon className="h-6" />
                  <span>Security</span>
                </NavLink>
              </li>
            </ol>
          </nav>
        </div>
        {/* main componnet */}
        <div className="ml-10 mr-0 p-3 shadow-sm rounded-md bg-white dark:bg-gray-800 dark:text-white">
          <h1 className="text-2xl font-sans">Edit your information</h1>
          <hr/>
          <form className="mt-5 mx-3">
            { profileMutation.isLoading ? <p className="text-center">Loading please wait</p> : null }
            { profileMutation.isError || (profileMutation.isSuccess && isUpdated) ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{isUpdated ? 'Awesome ' :'Uh-oh!'}</strong>
              <span className="block sm:inline">{isUpdated ? 'User profile edited successfully' : profileMutation.error?.message}</span>
              <span onClick={() => profileMutation.reset()} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                <XIcon className="h-6" />  
              </span>
            </div> : null}
            <div>
              <label className="block">Full Name:</label>
              <input 
                type="text"
                value={form.fullname}
                disabled={profileMutation.isLoading}
                placeholder="Fullname"
                onChange={(event) => updateForm({ ...form, fullname: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
            </div>

            <div>
              <label className="block">Email:</label>
              <input 
                type="text" 
                value={form.email}
                disabled={profileMutation.isLoading}
                placeholder="email"
                onChange={(event) => updateForm({ ...form, email: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
            </div>

            <div className="mb-2">
              <label className="block">Phone:</label>
              <input 
                type="number" 
                value={form.phone}
                disabled={profileMutation.isLoading}
                placeholder="Phone Number"
                onChange={(event) => updateForm({ ...form, phone: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
            </div>
            <hr />
            <div className="mt-5">
              <label className="block">Password:</label>
              <input 
                type="password" 
                placeholder="Password"
                disabled={profileMutation.isLoading}
                onChange={(event) => updateForm({ ...form, password: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                <small>Enter your password to confirm this activity</small>
            </div>

            <div className="flex items-baseline justify-between">
              <button disabled={profileMutation.isLoading} onClick={proccessSubmit} type="button" className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Submit</button>
            </div>
          </form>
          { changeEmail ? <React.Fragment>
            <Notice
              title="Email Changed"
              message="You are about to change your registered email, this new email address will be used to log you in."
              actionText="confirm"
              actionClicked={() => {
                proceedChange(false);
                profileMutation.mutate({ ...form, oldEmail: user?.email })
              }}
              cancelClicked={() => {
                proceedChange(false)
              }}
              forceAction={false} />
          </React.Fragment> : null }
        </div>
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
};
export default connect(state => ({ user:state.user }))(Profile);