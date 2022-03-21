import { CreditCardIcon, SwitchHorizontalIcon, UserCircleIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import ChatWith from "../components/ChatWith";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { BitcoinBtcLogo, EthereumEthLogo, TetherUsdtLogo } from "../components/svg";

const Landing = ({ services }) => {
  const [form, updateForm] = useState({ rate: 0, amount: 0 });

  return(<React.Fragment>
    <Header />
    {/* main component */}
    <main>
      <div className="mx-5 my-5 grid md:grid-cols-2 gap-4">
        {/* col-1 */}
        <div className="">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-5xl">
            <span className="block xl:inline">Trade with <strong className="">101digital</strong> </span>{' '}
            <span className="text-3xl block text-red-400 xl:inline">Sell cryptocurrencies and giftcards</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-white sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl lg:mx-0">101digital.com is an online platform where you can exchange your giftcards and cryptocurrencies to your local banks.</p>
          <div style={{maxWidth:'400px'}} className="flex items-center justify-between">
            <NavLink to="/dashboard/trade" className="w-6/12 mr-2 inline-block text-center bg-red-500 border border-transparent rounded-md py-3 px-4 font-medium text-white hover:bg-red-700">
              Trade Now
            </NavLink>
            <NavLink to="/dashboard/trade" className="w-6/12 ml-2 inline-block text-center bg-gray-100 border rounded-md py-3 px-4 font-medium text-dark hover:border-black">
              Sell your giftcards 
            </NavLink>
          </div>
        </div>
        {/* col-2 */}
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white dark:bg-gray-800 dark:text-white space-y-6 sm:p-6">
              <div>
                <label htmlFor="select-service">Send</label>
                <div className="mt-1 dark:text-black">
                  <select onChange={(event) => updateForm({ ...form, rate:event.target.value})} className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md">
                    <option value={null}>select an option</option>
                    {services?.map((item, idx) => (
                      <option key={idx} value={item?.rate}>{item?.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    onChange={(event) => updateForm({ ...form, amount:event.target.value })}
                    className="dark:text-black pl-12 shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>

              <div>
                <label>Recieve</label>
                <div className="mt-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input disabled value={((form.rate && form.amount) && new Intl.NumberFormat().format(parseFloat(form.rate) * form.amount)) || 0} type="text" className="dark:text-black pl-12 shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                      <span className="text-gray-500 sm:text-sm">Naira</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <NavLink to="/dashboard/trade" className="w-[100%] inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                  Trade Now
                </NavLink>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="px-5 py-10">
        <div className="flex items-center justify-center">
          <h3 className="font-bold text-4xl text-gray-600 dark:text-white">Get started in a few minutes</h3>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="shadow sm:rounded-md text-center">
            <div className="bg-white dark:bg-gray-800 px-3 py-10">
              <UserCircleIcon className="h-[55px] inline text-red-600" />
              <h3 className="font-bold dark:text-white">Create an account</h3>
              <span className='text-gray-400 hover:text-gray-600'>Complete your profile</span>
            </div>
          </div>

          <div className="shadow sm:rounded-md text-center">
            <div className="bg-white dark:bg-gray-800 px-3 py-10">
              <CreditCardIcon className="h-[55px] inline text-red-600" />
              <h3 className="font-bold">Link your bank account</h3>
              <span className='text-gray-400 hover:text-gray-600'>No charges added</span>
            </div>
          </div>

          <div className="shadow sm:rounded-md text-center">
            <div className="bg-white dark:bg-gray-800 px-3 py-10">
              <SwitchHorizontalIcon className="h-[55px] inline text-red-600" />
              <h3 className="font-bold">Start trading now</h3>
              <NavLink to="/register" className='text-red-400 hover:text-red-600'>Start now</NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-10">
        <div className="flex items-center justify-center">
          <h3 className="font-bold text-4xl text-gray-600 dark:text-white">Our popular services</h3>
        </div>

        <div className="mt-5 grid lg:grid-cols-3 md:grid-cols-2 gap-4">
          <div className="shadow sm:rounded-md text-center">
            <div className="bg-white dark:bg-gray-800 px-3 py-10">
              {/* <UserCircleIcon className="h-[55px] inline text-red-600" /> */}
              <div className="flex justify-center mb-5 -space-x-1 overflow-hidden">
                <BitcoinBtcLogo className="inline-block h-[65px]" />
                <EthereumEthLogo className="inline-block h-[65px]" />
                <TetherUsdtLogo className="inline-block h-[65px]" />
              </div>
              <h3 className="font-bold dark:text-white">Bitcoin</h3>
              <p className='text-gray-400 hover:text-gray-600'>$50 to $100 single</p>
              <NavLink to="/dashboard" className="text-red-400 hover:text-red-600">Trade Now</NavLink>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />

    {/* chat comp */}
    <ChatWith />
  </React.Fragment>)
}

export default connect((state) => ({ services: state.app.services }))(Landing);