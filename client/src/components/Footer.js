import React from "react";
import { FacebookLogo, InstagramLogo, TwitterLogo } from "./svg";

const Footer = () => {
  return(<React.Fragment>
    <footer className="text-center dark:bg-gray-700 dark:text-white">
      <div className="px-6 py-5 pb-2">
        <div className="flex justify-center">
          <span className="rounded-full border-2 dark:border-white dark:text-white border-red-400 leading-normal uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out h-[45px] w-[45px] m-1">
            <InstagramLogo className="w-5 h-full mx-auto" />
          </span>
          <span className="rounded-full border-2 dark:border-white dark:text-white border-red-400 leading-normal uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out h-[45px] w-[45px] m-1">
            <TwitterLogo className="w-5 h-full mx-auto" />
          </span>
          <span className="rounded-full border-2 dark:border-white dark:text-white border-red-400 leading-normal uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out h-[45px] w-[45px] m-1">
            <FacebookLogo className="w-5 h-full mx-auto" />
          </span>
        </div>
      </div> 
      <hr/>
      <div className="text-center p-4 pt-2">
        © 2021 Copyright: <span className="dark:text-white">101digitals</span>
      </div> 
    </footer>
  </React.Fragment>)
}

export default Footer;