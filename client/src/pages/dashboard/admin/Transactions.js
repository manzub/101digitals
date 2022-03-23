import React, { useState } from "react"; 
import { connect } from "react-redux"; 
import { useMutation, useQuery, useQueryClient } from "react-query";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../../components/ChatWith";
import Notice from "../../../components/Notice";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronUpIcon, CollectionIcon, ServerIcon, XIcon } from "@heroicons/react/outline";
import backendApi, { backendUrl } from "../../../utils/backendApi";
import { Disclosure } from "@headlessui/react";

const allowedRoles = [1];
// TODO: test update transactions
const Transactions = ({ user }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [allTx, setTransactions] = useState(null);
  const [mutationState, setMutationState] = useState(null);

  const isAdmin = user.email && allowedRoles.includes(user?.role)
  const numberFormat = new Intl.NumberFormat();

  const txQuery = useQuery('transactions', () => {
    return backendApi.allTransactions(user?.accessToken);
  }, { onSuccess: function(data) {
    if(data.status === 1) setTransactions(data.transactions);
    else throw new Error(data.message);
  } })

  const mutation = useMutation(postData => {
    return backendApi.updateTransaction(postData, user?.accessToken);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      queryClient.invalidateQueries('transactions');
      console.log(data);
      // reload users
      setMutationState(data.message)
    }else throw new Error(data.message);
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
            <h1 className="text-2xl font-sans">Manage Transactions</h1>
          </div>
          <hr/>
          <div className="mt-5 w-full max-w-md mx-auto">
            { txQuery.isLoading && <p>Loading...</p>}
            { txQuery.isError && <p>{txQuery.error?.message}</p>}

            { (mutation.isError || mutation.isSuccess) ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{mutationState ? 'Awesome ' :'Uh-oh!'}</strong>
              <span className="block sm:inline">{mutationState ? mutationState : mutation.error?.message}</span>
              <span onClick={() => mutation.reset()} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                <XIcon className="h-6" />  
              </span>
            </div> : null}

            { allTx?.map((item, idx) => (<React.Fragment key={idx}>
              <Disclosure as='div' className='mt-2'>
                {({ open }) => (<>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-4 text-md font-medium text-left text-red-900 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75">
                    <span>{`${item?.userInfo?.fullname} (${item?.transaction?.service?.name})`}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-red-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <React.Fragment>
                      <h3 className="font-bold font-sans">Service Info:</h3>
                      <ul>
                        <li>Name: {item?.transaction?.service?.name}</li>
                        <li>Denominations: {item?.transaction?.service?.denominations}</li>
                        <li>Type: {item?.transaction?.service?.type}</li>
                        <li>Rate: {item?.transaction?.service?.rate}</li>
                      </ul><hr/>
                      <h3 className="font-bold font-sans">Transaction Info:</h3>
                      <ul>
                        <li>Transfered: ($){item?.transaction?.amountValue}</li>
                        <li>Expecting: (N){numberFormat.format(item?.transaction?.returnValue)}</li>
                        <li>Notes: {item?.transaction?.notes || 'null'}</li>
                        <li>Uploads: {item?.transaction?.uploads?.map((file, idx) => (
                          <span onClick={() => window.open(`${backendUrl}/uploads/${file}`, '_blank')} className="cursor-pointer text-red-400 hover:text-red-600" key={idx}>view file</span>
                        ))}</li>
                      </ul><hr/>
                      <h3 className="font-bold font-sans">User Info:</h3>
                      <ul>
                        <li>Name: {item?.userInfo?.fullname}</li>
                        <li>Email: {item?.userInfo?.email}</li>
                        <li>Phone: {item?.userInfo?.phone}</li>
                      </ul><hr/>
                      <h3 className="font-bold font-sans">Account Info:</h3>
                      <ul>
                        <li>Account Name: {item?.userInfo?.bankInfo?.accountName}</li>
                        <li>Account Number: {item?.userInfo?.bankInfo?.accountNo}</li>
                        <li>Bank: {item?.userInfo?.bankInfo?.bank}</li>
                      </ul><hr/>
                      <div className="flex items-end space-x-5">
                        {item?.transaction?.status === 'pending' ? <React.Fragment>
                          <button onClick={() => mutation.mutate({txId:item?.transactions?.id, status:'completed', email:item?.userInfo?.email})} className="p-3 bg-success hover:bg-teal-600">Confirm</button>
                          <button onClick={() => mutation.mutate({txId:item?.transactions?.id, status:'rejected', email:item?.userInfo?.email})} className="p-3 bg-red-400 hover:bg-red-600">Reject</button>
                        </React.Fragment> : <span className="p-4 bg-yellow-400">{item?.transaction?.status}</span>}
                      </div>
                    </React.Fragment>
                  </Disclosure.Panel>
                </>)}
              </Disclosure>   
            </React.Fragment>))}
          </div>
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