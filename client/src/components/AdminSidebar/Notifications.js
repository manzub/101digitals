import { Popover, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/outline";
import { ExclamationIcon } from "@heroicons/react/solid";
import React from "react";

const Notifications = ({ notifications }) => {

  return(<React.Fragment>
    <div className="">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button>
              <span className="relative inline-block mx-3">
                <BellIcon className="h-[35px] text-gray-600 dark:text-white" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full">{notifications?.length}</span>
              </span>
            </Popover.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-[275px] -left-1/2 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  {/* notifications div */}
                  <div className="relative grid gap-8 bg-white p-5 lg:grid-cols-2">
                    {notifications?.map((item, idx) => (
                      <span key={idx} className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                          <ExclamationIcon className="text-yellow-100" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.message}
                          </p>
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>  
    </div>
  </React.Fragment>)
}

export default Notifications;