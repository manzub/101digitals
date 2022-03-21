import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react'
import { BellIcon, LoginIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useSelector } from 'react-redux';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Header() {
  const user = useSelector(state => state.user);

  const [topbar, disableTopbar] = useState(true);
  const topbarBackgroundColor = '#cf7c7c';

  const isLoggedIn = !!(user.email && user.accessToken);

  return(<React.Fragment>
    {topbar ? <div className='bg-red-500'>
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">We announced a new product!</span>
              <span className="hidden md:inline">Big news! We're excited to announce a brand new product.</span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <NavLink
              to="/register"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white hover:bg-indigo-50" style={{color: topbarBackgroundColor}}>
              Get started
            </NavLink>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              onClick={() => disableTopbar(false)}
              type="button"
              className="-mr-1 flex p-2 rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-6 w-6 text-white hover:text-gray-600" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div> : null}
    {/* main component here */}
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  {/* nav brand here */}
                  101digitals
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <NavLink to="/">
                      <span className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium' aria-current='page' >Home</span>
                    </NavLink>
                    {/* Menu options here */}
                    <NavLink to="/dashboard/trade">
                      <span className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','px-3 py-2 rounded-md text-sm font-medium')}>Trade</span>
                    </NavLink>
                    {/* TODO: other option */}
                    <span className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','px-3 py-2 rounded-md text-sm font-medium')}>Rates</span>
                    <span className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','px-3 py-2 rounded-md text-sm font-medium')}>FAQ</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-">
                <ThemeToggle />
                <NavLink to="/dashboard" className="text-center flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-[35px] m-0" aria-hidden="true" />
                </NavLink>

                {/* show login button if is not logged in */}
                { isLoggedIn ? <button type="button" className="ml-2 block text-center flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="sr-only">Dashboard</span>
                  <Link to='/dashboard'>
                    <DesktopComputerIcon className="h-[35px] m-0" aria-hidden="true" />
                  </Link>
                </button> : <button type="button" className="ml-2 block text-center flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="sr-only">Log In</span>
                  <Link to='/login'>
                    <LoginIcon className="h-[35px] m-0" aria-hidden="true" />
                  </Link>
                </button>}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <span className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium' aria-current='page' >Explore</span>
              {/* Menu options here */}
              <button className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','block px-3 py-2 rounded-md text-base font-medium')}>
                <Disclosure.Button as="span">Trade</Disclosure.Button>
              </button>
              <button className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','block px-3 py-2 rounded-md text-base font-medium')}>
                <Disclosure.Button as="span">Rates</Disclosure.Button>
              </button>
              <button className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','block px-3 py-2 rounded-md text-base font-medium')}>
                <Disclosure.Button as="span">FAQ</Disclosure.Button>
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </React.Fragment>)
}

export default Header;