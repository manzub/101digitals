import { CreditCardIcon } from "@heroicons/react/outline";

const Loading = () => {
  return(<div className="flex justify-center items-center h-screen dark:text-white">
    <div className="spinner-border animate-spin inline-block p-5 border-4 rounded-full" role="status">
      <CreditCardIcon className="h-[35px]" />
      <span className="sr-only">Loading...</span>
    </div>
  </div>)
}

export default Loading;