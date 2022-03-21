import React from 'react'
import { ThemeContext } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

export default function ThemeToggle() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <div className="py-16">
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="button" className="text-center flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-800 dark:hover:text-white">
        <span className="sr-only">Toggle { theme === 'dark' ? 'Light' : 'Dark Mode' }</span>
        { theme === 'dark' ? <SunIcon className='h-[35px] m-0' /> : <MoonIcon className='h-[35px] m-0' /> }
      </button>
    </div>
  )
}
