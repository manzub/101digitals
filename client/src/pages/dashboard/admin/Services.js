import React, { useState } from "react"; 
import { connect } from "react-redux";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../../components/ChatWith";
import Notice from "../../../components/Notice";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronUpIcon, CollectionIcon, PlusIcon, ServerIcon, XIcon } from "@heroicons/react/outline";
import { Disclosure } from "@headlessui/react";
import { useQueryClient, useMutation } from "react-query";
import backendApi from "../../../utils/backendApi";

const allowedRoles = [1];

const Services = ({ user, services }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setEditing] = useState(null);
  const [mutationState, setMutationState] = useState(null);

  const defaultForm = { name: '', denominations: '', type: '', rate: '' };
  const [addNewForm, updateForm] = useState(defaultForm);
  const [addNew, toggleAddNew] = useState(false);

  const isAdmin = user.email && allowedRoles.includes(user?.role)

  const createMutation = useMutation(postData => {
    if(!(postData.name && postData.denominations && postData.type && postData.rate)) throw new Error('fill in all fields');
    return backendApi.createService(postData, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setEditing(null);
      setMutationState(data.message);
      queryClient.invalidateQueries('services');
    } else throw new Error(data.message);
  } });

  const editMutation = useMutation(postData => {
    if(!(postData.name && postData.denominations && postData.type && postData.rate)) throw new Error('fill in all fields');
    return backendApi.updateService(postData, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    console.log(data);
    if(data.status === 1) {
      updateForm(defaultForm);
      setMutationState(data.message);
      queryClient.invalidateQueries('services');
    } else throw new Error(data.message);
  } });

  const deleteMutation = useMutation(itemId => {
    if(!itemId) throw new Error('cannot delete empty item');
    return backendApi.deleteService(itemId, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setEditing(null);
      setMutationState(data.message);
      queryClient.invalidateQueries('services');
    } else throw new Error(data.message);
  } })


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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-sans">All Services</h1>
            <button onClick={() => toggleAddNew(true)} className="flex rounded-lg bg-red-500 hover:bg-red-600 p-3 text-white dark:text-black">
              <PlusIcon className="h-6" /> Add New
            </button>
          </div>
          <hr/>
          {/* services div */}
          <div className="mt-5 w-full max-w-md mx-auto">
          { (createMutation.isError || createMutation.isSuccess) || (editMutation.isError || editMutation.isSuccess) || (deleteMutation.isError || deleteMutation.isSuccess) ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{mutationState ? 'Awesome ' :'Uh-oh!'}</strong>
              <span className="block sm:inline">{mutationState ? mutationState : (editMutation.error?.message || deleteMutation.error?.message || createMutation.error?.message)}</span>
              <span onClick={() => { return (editMutation.reset() || deleteMutation.reset() || createMutation.reset()) }} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                <XIcon className="h-6" />  
              </span>
            </div> : null}
            { addNew ? <React.Fragment>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">New Service</h2>
                <button onClick={() => {
                  updateForm(defaultForm);
                  toggleAddNew(false);
                }} className="cursor-pointer hover:text-red-600">
                  <XIcon className="h-6" />
                </button>
              </div>
              {/* form goes here */}
              <div>
                <label className="block">Name:</label>
                <input 
                  type="text"
                  disabled={createMutation.isLoading}
                  placeholder="Name of service"
                  onChange={(event) => updateForm({ ...addNewForm, name: event.target.value })}
                  className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
              </div>
              <div>
                <label className="block">Denominations:</label>
                <input 
                  type="text"
                  disabled={createMutation.isLoading}
                  placeholder="Denominations"
                  onChange={(event) => updateForm({ ...addNewForm, denominations: event.target.value })}
                  className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                  <small>Denominations (e.g Giftcard $50 - $100 single / Bitcoin $100 - $500)</small>
              </div>
              {addNewForm?.type === 'crypto' && <React.Fragment>
                <div>
                  <label className="block">Coin Symbol:</label>
                  <input 
                    type="text"
                    disabled={createMutation.isLoading}
                    placeholder="Coin symbol"
                    onChange={(event) => updateForm({ ...addNewForm, coinname: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                    <small>Coin symbol (e.g BTC, ETH, USDT)</small>
                </div>
                <div>
                  <label className="block">Wallet Address:</label>
                  <input 
                    type="text"
                    disabled={createMutation.isLoading}
                    placeholder="Wallet Address"
                    onChange={(event) => updateForm({ ...addNewForm, cryptoAddress: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                    <small>Wallet address that customers will  transfer funds too (e.g 0x44334354f4wf4...)</small>
                </div>
              </React.Fragment>}
              <div>
                <label className="block">Service Type:</label>
                <select disabled={createMutation.isLoading} onChange={(event) => updateForm({ ...addNewForm, type: event.target.value })} className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md">
                  <option>Select an option</option>
                  <option value='crypto'>Cryptocurrency</option>
                  <option value='giftcard'>Giftcard</option>
                </select>
              </div>
              <div>
                <label className="block">Rate:</label>
                <input 
                  type="number"
                  disabled={createMutation.isLoading}
                  placeholder="Rate"
                  onChange={(event) => updateForm({ ...addNewForm, rate: event.target.value })}
                  className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                  <small>Rate e.g $1 {'->'} N[500] 👈 thats the rate</small>
              </div>
              <div className="flex items-baseline justify-between">
                <button disabled={createMutation.isLoading} onClick={() => createMutation.mutate(addNewForm)} type="button" className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Submit</button>
              </div>

            </React.Fragment> : <React.Fragment>
              { services?.map((item, idx) => (<React.Fragment>
                <Disclosure key={idx} as='div' className='mt-2'>
                  {({ open }) => (<>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-4 text-md font-medium text-left text-red-900 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75">
                      <span>{item?.name}</span>
                      <ChevronUpIcon
                        className={`${
                          open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-red-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      {isEditing ? <React.Fragment>
                        {/* form goes here */}
                        <div>
                          <label className="block">Name:</label>
                          <input 
                            type="text"
                            value={isEditing?.name}
                            // disabled={profileMutation.isLoading}
                            placeholder="Name of service"
                            onChange={(event) => setEditing({ ...isEditing, name: event.target.value })}
                            className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                        </div>
                        <div>
                          <label className="block">Denominations:</label>
                          <input 
                            type="text"
                            value={isEditing?.denominations}
                            disabled={editMutation.isLoading}
                            placeholder="Denominations"
                            onChange={(event) => setEditing({ ...isEditing, denominations: event.target.value })}
                            className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                            <small>Denominations (e.g Giftcard $50 - $100 single / Bitcoin $100 - $500)</small>
                        </div>
                        {isEditing?.type === 'crypto' && <React.Fragment>
                          <div>
                            <label className="block">Coin Symbol:</label>
                            <input 
                              type="text"
                              value={isEditing?.coinname}
                              disabled={editMutation.isLoading}
                              placeholder="Coin symbol"
                              onChange={(event) => setEditing({ ...isEditing, coinname: event.target.value })}
                              className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                              <small>COin symbol (e.g BTC, ETH, USDT)</small>
                          </div>
                          <div>
                            <label className="block">Wallet Address:</label>
                            <input 
                              type="text"
                              disabled={editMutation.isLoading}
                              placeholder="Wallet Address"
                              onChange={(event) => setEditing({ ...isEditing, cryptoAddress: event.target.value })}
                              className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                              <small>Wallet address that customers will  transfer funds too (e.g 0x44334354f4wf4...)</small>
                          </div>  
                        </React.Fragment>}
                        <div>
                          <label className="block">Service Type:</label>
                          <select disabled={editMutation.isLoading} onChange={(event) => setEditing({ ...isEditing, type: event.target.value })} className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md">
                            <option>Select an option</option>
                            <option value='crypto'>Cryptocurrency</option>
                            <option value='giftcard'>Giftcard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block">Rate:</label>
                          <input 
                            type="number"
                            value={isEditing?.rate}
                            disabled={editMutation.isLoading}
                            placeholder="Rate"
                            onChange={(event) => setEditing({ ...isEditing, rate: event.target.value })}
                            className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                            <small>Rate e.g $1 {'->'} N[500] 👈 thats the rate</small>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <button disabled={editMutation.isLoading} onClick={() => editMutation.mutate(isEditing)} type="button" className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Submit</button>
                          <button disabled={editMutation.isLoading} onClick={() => setEditing(null)} type="button" className="px-6 py-2 mt-4 text-white bg-blue-400 rounded-lg hover:bg-blue-600">Cancel</button>
                        </div>
                      </React.Fragment> : <React.Fragment>
                        <p>Denominations: {item?.denominations}</p>
                        <p>Type: {item?.type}</p>
                        <p>Rate: {item?.rate}</p>
                        <div className="flex items-end space-x-5">
                          <button onClick={() => setEditing(item)} className="p-4 hover:bg-blue-500 bg-blue-400 text-white dark:text-gray-800 rounded-lg">Edit</button>
                          <button onClick={() => window.confirm('are you sure') && deleteMutation.mutate(item?._id)} className="p-4 hover:bg-red-500 bg-red-400 text-white dark:text-gray-800 rounded-lg">Delete</button>
                        </div>
                      </React.Fragment>}
                    </Disclosure.Panel>
                  </>)}
                </Disclosure>   
              </React.Fragment>))}
            </React.Fragment> }
          </div>
        </div>
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
};
export default connect(state => ({ user: state.user, services:state.app.services }))(Services);