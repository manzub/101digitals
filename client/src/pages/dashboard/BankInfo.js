import React, { useState } from "react"; 
import { connect } from "react-redux"; 
import { useMutation, useQueryClient } from "react-query"; 
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../components/ChatWith";
import Notice from "../../components/Notice";
import { NavLink, useNavigate } from "react-router-dom";
import { CashIcon, LockClosedIcon, UserIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import backendApi from "../../utils/backendApi";

const allowedRoles = [1, 2, 3]
const BankInfo = ({ user }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const defaultForm = { accountNo: user?.bankInfo?.accountNo || '', accountName: user?.bankInfo?.accountName || '', bank: user?.bankInfo?.bank || '', type: user?.bankInfo?.accountType || '', password: null };
  const [form, updateForm] = useState(defaultForm);

  const [isUpdated, setMutationState] = useState(false);

  const isAdmin = user.email && allowedRoles.includes(user?.role)

  const mutation = useMutation(postData => {
    if(!(postData.accountNo && postData.accoutName && postData.bank && postData.type && postData.password)) throw new Error('fill in all fields');
    return backendApi.updateUserBankInfo({...postData, email:user?.email}, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setMutationState(true);
      queryClient.invalidateQueries('user-token');
      alert('Log in again to see new chnages')
    } else throw new Error(data.message);
  } })

  const proccessSubmit = () => {
    window.scrollTo(0, 0);
    mutation.mutate(form);
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
        <nav className="flex items-center justify-center my-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-3 md:space-x-5">
            <li className="inline-flex items-center">
              <NavLink to="/dashboard/profile" className={"inline-flex items-center "+breadcrumbClassName}>
                <UserIcon className="h-6" />
                {/* active page */}
                <span className="truncate">Edit Profile</span>
              </NavLink>
            </li>
            <li className={"inline-flex items-center text-red-400 "+breadcrumbClassName}>
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
        {/* main componnet */}
        <div className="p-3 shadow-sm rounded-md bg-white dark:bg-gray-800 dark:text-white">
          <h1 className="text-2xl font-sans">Edit your bank information</h1>
          <hr/>
          <form className="mt-5 mx-3">
            { mutation.isLoading ? <p className="text-center">Loading please wait</p> : null }
            { mutation.isError || (mutation.isSuccess && isUpdated) ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{isUpdated ? 'Awesome ' :'Uh-oh!'}</strong>
              <span className="block sm:inline">{isUpdated ? 'Bank Information edited successfully' : mutation.error?.message}</span>
              <span onClick={() => mutation.reset()} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                <XIcon className="h-6" />  
              </span>
            </div> : null}

            <div>
              <label className="block">Account Name:</label>
              <input 
                type="text"
                value={form.accountName}
                disabled={mutation.isLoading}
                placeholder="Account Holder Name"
                onChange={(event) => updateForm({ ...form, accountName: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
            </div>

            <div>
              <label className="block">Account Number:</label>
              <input 
                type="number"
                value={form.accountNo}
                disabled={mutation.isLoading}
                placeholder="Account Number"
                onChange={(event) => updateForm({ ...form, accountNo: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
            </div>

            <div>
              <label className="block">Bank:</label>
              <select disabled={mutation.isLoading} onChange={(event) => updateForm({ ...form, bank: event.target.value })} className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md">
                <option>Select an option</option>
                <option>GT Bank</option>
                <option>Zenith Bank</option>
                <option>First Bank</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block">Account Type:</label>
              <select disabled={mutation.isLoading} onChange={(event) => updateForm({ ...form, type: event.target.value })} className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md">
                <option>Select an option</option>
                <option value='savings'>Savings Account</option>
                <option value='current'>Current Account</option>
              </select>
            </div>

            <hr />
            <div className="mt-5">
              <label className="block">Password:</label>
              <input 
                type="password" 
                placeholder="Password"
                disabled={mutation.isLoading}
                onChange={(event) => updateForm({ ...form, password: event.target.value })}
                className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                <small>Enter your password to confirm this activity</small>
            </div>

            <div className="flex items-baseline justify-between">
              <button disabled={mutation.isLoading} onClick={proccessSubmit} type="button" className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
};
export default connect(state => ({ user:state.user }))(BankInfo);