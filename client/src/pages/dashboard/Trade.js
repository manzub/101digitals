import { CheckIcon, ClipboardCopyIcon, CreditCardIcon, CurrencyDollarIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { v4 as uuidV4 } from 'uuid';
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useClipboard } from 'use-clipboard-copy';
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import ChatWith from "../../components/ChatWith";
import Notice from "../../components/Notice";
import { backendUrl } from "../../utils/backendApi";

const termsNcondition = "You hereby warrant, assure, represent and state that the items you are transacting on, selling, loading or offering for sale on Mybtcnigeria.com was acquired through legal means. You further state that you did not in any manner act as agent of the Website in the acquisition of the items. You hereby, specifically state that the items were not stolen or obtained through fraudulent means Note: ₦10 bank transfer charge will be deducted on all withdrawals made on this platform. We won't be held responsible for funding a wrong Account Number provided by you. Pls always crosscheck the info you filled. By Clicking the \"Exchange Now\" button, you agree that you have read and agreed to our Terms of Service and you understand that all transfers are final and cannot be reversed.";
// TODO: coin api options 

const allowedRoles = [3]
const Trade = ({ user, services }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clipboard = useClipboard({ copiedTimeout: 1000 });

  const defaultForm = { amountValue: 0, returnValue: 0, orderNotes: '', uploads: null, fileKey: 'file' };
  const [form, updateForm] = useState(defaultForm);
  const [selected, updateSelected] = useState(null);
  const [termsAndConditions, showTC] = useState(false);

  const [waitingAsync, setAsync] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const isAdmin = user?.email && allowedRoles.includes(user?.role)

  const clearAync = () => setAsync(false);

  useEffect(() => {
    if(user?.bankInfo) {
      const { accountNo, accountName, bank } = user?.bankInfo;
      if(!(accountName && accountNo && bank)) setErrorState('Add Bank Info before trading')
    } else setErrorState('Add Bank Info before trading');
  }, [user?.bankInfo])
  
  const processSubmit = async () => {
    window.scrollTo(0, 0)
    setAsync(true);

    let errorFound = false;
    Object.entries(form).forEach(field => {
      if(field[1] === null || field[1] === 0 || field[1] === '') {
        if((selected?.type === 'crypto' && field[0] !== 'uploads')) {
          setErrorState(` ${field[0]} cannot be empty`)
          errorFound = true;
          return clearAync();
        }
      }
    })
    if(!errorFound) {
      try {
        if(selected?.type !== 'crypto' && (!form.uploads || form.uploads.length < 1)) {
          throw new Error('please upload '+selected?.type+' files');
        }

        if(form.uploads?.length > 0) {
          const data = new FormData();
          for (let index = 0; index < form.uploads?.length; index++) {
            const element = form.uploads[index];
            data.append('file', element);
          }
          const response = (await axios.post(`${backendUrl}/trade/upload-files`, data, { headers: { 'x-access-token': user?.accessToken } })).data
          if(response.status === 1) return createTrade(response.filename);
          else throw new Error(response.message);
        }
        return createTrade([]);
      } catch (error) {
        console.log(error);
        setErrorState(error.message)
        clearAync();
      }
    }
  }

  const createTrade = async (uploadFiles) => {
    const files = [];
    uploadFiles.forEach(item => files.push(item.filename))
    const postData = { txId: uuidV4(), email: user?.email, serviceId: selected?._id, amountValue: form.amountValue, returnValue: form.returnValue, orderNotes: form.orderNotes, uploads: files };
    const postResponse = (await axios.post(`${backendUrl}/trade/new-transaction`, postData, { headers: { 'x-access-token': user?.accessToken } })).data
    if(postResponse.status === 0) throw new Error(postResponse.message);
    // proceed
    dispatch({ type: 'REFRESH-USER', payload: { transactions: postResponse.data.transactions, notifications: postResponse.data.notifications } })
    setErrorState(postResponse.message);
    clearAync();
  }

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
      {/* contents */}
      <div className="mx-5 pl-10 md:pl-0 my-5">
        <h3 className="text-center text-3xl dark:text-white">Trade With Us</h3>
        <hr/>
        { selected ? <React.Fragment>
          { waitingAsync ? <p className="text-center">Loading...</p> : null }
          {errorState ? <div className="mt-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Uh-oh!</strong>
            <span className="block sm:inline">{errorState}</span>
            <span onClick={() => setErrorState(null)} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
              <XIcon className="h-6" />  
            </span>
          </div> : null}

          <form className="my-3 shadow-md rounded-md">
            <div className="bg-white dark:text-white dark:bg-gray-800 p-5">
              <div>
                <label>Selected Service:</label>
                <div className="relative">
                  <input disabled value={`${selected?.name} (${selected?.denominations})` || ''} type="text" className="dark:bg-gray-700 shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
                  <div onClick={() => updateSelected(null)} className=" absolute inset-y-0 right-0 flex items-center pr-5">
                    <XIcon className="hover:text-red-400 cursor-pointer text-gray-500 sm:text-sm h-6" />
                  </div>
                </div>
              </div>

              <div>
                <label>Enter Value ($)</label>
                {/* input field */}
                <div className="relative">
                  <input 
                  type="number"
                  placeholder={0}
                  onChange={(event) => {
                    let amountValue = parseFloat(event.target.value || 0);
                    const returnValue = (selected && (parseFloat(selected?.rate * amountValue)) ) || 0;
                    updateForm({ ...form, amountValue, returnValue });
                  }}
                  className="dark:bg-gray-700 shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
                  <div className=" absolute inset-y-0 right-0 flex items-center pr-5">
                    <span className="text-gray-500 sm:text-sm h-6">USD</span>
                  </div>
                </div>
                <div>
                  { selected && selected?.type === 'crypto' && <h5>Converted Value: <strong>0.00 COIN-NAME</strong></h5>}
                  <h5>Return Value: <strong>N{new Intl.NumberFormat().format(form.returnValue)}</strong></h5>
                </div>
              </div>

              {/* if is crypto */}
              {selected && selected?.type === 'crypto' ? <div className="mt-4">
                {/* TODO: converted value */}
                <label>Send ${form.amountValue} / 0.25 COIN-NAME to this address</label>
                <div className="border border-red-400">
                  <div className="flex items-center justify-between w-[300px] md:w-full">
                    <p className="p-3 truncate">{selected?.cryptoAddress}</p>
                    <span onClick={() => clipboard.copy(selected?.cryptoAddress)} className="cursor-pointer flex p-3 hover:text-white hover:bg-red-400">
                      {clipboard.copied ? <CheckIcon className="h-6" /> : <ClipboardCopyIcon className="h-6" />}
                      Copy
                    </span>
                  </div>  
                </div>
              </div> : null}

              <div className="mt-3">
                <label>Order Notes:</label>
                <textarea onChange={(event) => updateForm({ ...form, orderNotes: event.target.value })} className="dark:bg-gray-700 shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
                { selected && selected?.type === 'crypto' ? 
                  <p className="text-yellow-600">**<strong style={{fontSize:12}}>Enter the wallet you are sending from and address eg (Metamask - your wallet address...) or (Trustwallet - your wallet address...) etc</strong></p> : 
                  <p className="text-yellow-600">**<strong style={{fontSize:12}}>Enter the card denominations eg 100x2, 50x2, 25x4 etc</strong></p>
                }
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Images:</label>
                {/* if crypto */}
                {selected && selected?.type === 'crypto' ? <small className="block text-xs">(Optional) Upload transaction reciept</small> : <small className="block text-xs">Giftcard Images</small>}
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    { form.uploads && form.uploads.length > 0 ? <div className="flex items-center">
                      <span>Selected ({form.uploads.length})</span>
                      <XIcon onClick={() => updateForm({ ...form, fileKey: Math.random().toString(36), uploads: null })} className="text-red-500 h-6 cursor-pointer" />
                    </div> : <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                        <span>Upload a file(s)</span>
                        <input key={form.fileKey} onChange={(event) => updateForm({ ...form, uploads: event.target.files })} multiple id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            {/* submit button */}
            <div className="bg-gray-100 dark:bg-gray-900 p-2">
              <button onClick={() => showTC(true)} type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Trade Now
              </button>
            </div>
          </form>
        </React.Fragment> : 
        // services div
        <React.Fragment>
          <div className=" mt-5">
            <h3 className="text-center dark:text-white">Select A service</h3>
            <div className="grid md:grid-cols-2 gap-4">
              { services?.map((item, idx) => (<React.Fragment key={idx}>
                <div onClick={() => updateSelected(item)} className="cursor-pointer shadow-md rounded-md bg-white hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-900 p-3">
                  <div className="flex items-center space-x-10">
                    {item.type === 'crypto' ? <CurrencyDollarIcon className="h-6 dark:text-white" /> : <CreditCardIcon className="h-6 dark:text-white" />}
                    <div className="block">
                      <h4 className="dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-300 hover:text-gray-700">{item.denominations}</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>)) }
            </div>
          </div>  
        </React.Fragment>}
        { termsAndConditions ? <React.Fragment>
          <Notice 
            title="Terms and Conditions" 
            message={termsNcondition} 
            actionText="Confirm" 
            actionClicked={() => {
              showTC(false);
              processSubmit();
            }} 
            cancelClicked={() => {
              updateForm(defaultForm);
              showTC(false);
            }} 
            forceAction={false} />
        </React.Fragment> : null }
      </div>
    </AdminSidebar>
    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
}

export default connect((state) => ({ user: state.user, services: state.app.services }))(Trade);