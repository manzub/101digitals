import { CashIcon, CollectionIcon, CreditCardIcon, HomeIcon, LockClosedIcon, LogoutIcon, MoonIcon, ServerIcon, SunIcon, SwitchHorizontalIcon, UserCircleIcon, UserIcon } from "@heroicons/react/outline";
import React from "react";  
import { connect, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import useToken from "../../hooks/useToken";
import Footer from "../Footer";
import "./AdminSidebar.css";
import Notifications from "./Notifications";

const adminRoles = { superAdmin: 1, attendant: 2, customer: 3 };

const AdminSidebar = ({ user, children }) => {
  // const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const { clearToken } = useToken();
  const { theme, setTheme } = React.useContext(ThemeContext);

  const isSuperAdmin = !!(user?.role && user?.role === 1);

  const logout = () => {
    clearToken();
    dispatch({ type: 'LOGOUT', action: null })
  }

  return(<React.Fragment>
    <div className="flex flex-row min-h-screen bg-gray-100 dark:bg-gray-700 text-gray-800">
      {/* sidebar */}
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-red-500">
        <div className="sidebar-header flex items-center justify-center py-4">
          <div className="inline-flex">
            <NavLink to='/' className="inline-flex flex-row items-center">
              <CreditCardIcon className="h-[35px] text-gray-800" />
              <span className="leading-10 text-gray-100 text-2xl font-bold ml-1 uppercase">101digitals</span>
            </NavLink>
          </div>  
        </div>
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            <li className="my-px">
              <NavLink to="/dashboard" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 bg-gray-100">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <HomeIcon className="h-[25px]" />
                </span>
                <span className="ml-3">Dashboard</span>
              </NavLink>
            </li>
            {!isSuperAdmin && <li className="my-px">
              <NavLink to="/dashboard/trade" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <SwitchHorizontalIcon className="h-[25px]" />
                </span>
                <span className="ml-3">Trade</span>
              </NavLink>
            </li>}

            { isSuperAdmin ? <React.Fragment>
              <li className="my-px">
                <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">SuperAdmin</span>
              </li>
              <li className="my-px">
                <NavLink to="/admin/services" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <ServerIcon className="h-[25px]" />
                  </span>
                  <span className="ml-3">Services</span>
                </NavLink>
              </li>
              <li className="my-px">
                <NavLink to="/admin/transactions" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <CollectionIcon className="h-[25px]" />
                  </span>
                  <span className="ml-3">Transactions</span>
                </NavLink>
              </li>
            </React.Fragment> : null}
            
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">Account</span>
            </li>
            <li className="my-px">
              <NavLink to="/dashboard/profile" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <UserIcon className="h-[25px]" />
                </span>
                <span className="ml-3">Profile</span>
              </NavLink>
            </li>
            {!isSuperAdmin ? <li className="my-px">
              <NavLink to="/dashboard/bank-info" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <CashIcon className="h-[25px]" />
                </span>
                <span className="ml-3">Bank Information</span>
              </NavLink>
            </li> : null}
            <li className="my-px">
              <NavLink to="/dashboard/security" className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <LockClosedIcon className="h-[25px]" />
                </span>
                <span className="ml-3">Security</span>
              </NavLink>
            </li>
            <li className="my-px">
              <span onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  { theme === 'dark' ? <SunIcon className="h-[25px]" /> : <MoonIcon className="h-[25px]" />}
                </span>
                <span className="truncate ml-3">{ theme === 'dark' ? 'Switch to Light' : 'Switch to Dark' }</span>
              </span>
            </li>

            <hr/>
            <li className="my-px">
              {/* logout button */}
              <span onClick={logout} className="cursor-pointer flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-gray-400">
                  <LogoutIcon className="h-[25px] text-red-800" />
                </span>
                <span className="ml-3">Logout</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
      {/* page header */}
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white dark:bg-gray-700 shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">

            <div className="md:hidden ml-10 flex justify-evenly items-center">
              <NavLink to="/dashboard/trade" className="mx-2 hover:bg-gray-200 px-3 py-1 text-red-400 ring-2 ring-red-300 rounded-md">
                Trade
              </NavLink>
              <div className=" relative inline-block text-left dropdown">
                <span className="rounded-md shadow-sm">
                  <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-white transition duration-150 ease-in-out bg-white dark:bg-gray-700 border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                    <span>Account</span>
                  </button>
                </span>
                <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                  <div className="absolute right-0 left-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                    <div className="py-1">
                      <NavLink to="/dashboard/profile" tabIndex="0" className="text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Profile</NavLink>
                      { isSuperAdmin && <React.Fragment>
                        <NavLink to="/admin/services" tabIndex="0" className="text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Services</NavLink>
                        <NavLink to="/admin/transactions" tabIndex="0" className="text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Transactions</NavLink>
                      </React.Fragment> }
                      {!isSuperAdmin && <NavLink to="/dashboard/bank-info"  tabIndex="1" className="text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Bank Info</NavLink>}
                      <span role="menuitem" tabIndex="-1" className="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 dark:text-white cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span>
                      <NavLink to="/dashboard/security" tabIndex="2" className="text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Security</NavLink>
                    </div>
                    <div className="py-1">
                      <span onClick={logout} tabIndex="3" className="cursor-pointer text-gray-700 dark:text-white hover:bg-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex ml-auto">
              <Notifications notifications={user?.notifications} />
              <div className="hidden md:block">
                <NavLink to="/dashboard/profile" className="flex flex-row items-center">
                  <UserCircleIcon className="h-[35px] text-gray-600 dark:text-white" />
                  <span className="flex flex-col ml-2">
                    <span className="truncate w-20 font-semibold dark:text-white tracking-wide leading-none">{user?.fullname}</span>
                    <span style={{textTransform:"capitalize"}} className="truncate w-20 text-gray-500 dark:text-white text-xs leading-none mt-1">{Object.keys(adminRoles)[Object.values(adminRoles).indexOf(user?.role)]}</span>
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </header>
        {/* content start */}
        <div className="main-content flex flex-col flex-grow">{children}</div>
        <Footer />
      </main>
    </div>
  </React.Fragment>)
};
export default connect(state => ({ user: state.user }))(AdminSidebar);