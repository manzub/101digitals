import { XIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import backendApi from "../../utils/backendApi";

const Register = ({ user }) => {

  const defaultForm = { email: null, password: null, fullname: null, phone: null };
  const [form, updateForm] = useState(defaultForm);
  const [redirectCountdown, setCountdown] = useState(5);
  const [isSignedUp, setSubmitState] = useState(false);

  const isLoggedIn = !!(user.email && user.accessToken);

  const navigate = useNavigate();
  const mutation = useMutation(function(postData) {
    const { email, fullname, phone, password } = postData;
    if(!(email && fullname && phone && password)) throw new Error('Fill in all fields');
    return backendApi.signup({...postData, email:email.toLowerCase()});
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setSubmitState(true);
    } else throw new Error(data.message);
  } });

  const processSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  }

  useEffect(() => {
    if(isLoggedIn  || isSignedUp) {
      if(redirectCountdown === 0) {
        setCountdown(null);
        navigate(isLoggedIn ? "/dashboard" : '/login');
      }

      const interval = redirectCountdown > 0 && setInterval(() => setCountdown(redirectCountdown  - 1), 1000) 
      return () => clearInterval(interval);
    }
  }, [redirectCountdown, isLoggedIn, isSignedUp, navigate]);

  return(<React.Fragment>
    <Header/>
    {/* main component */}
    <main className="py-5 px-6">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
        { isLoggedIn || isSignedUp ? <h3>Redirecting in {redirectCountdown}</h3> : <>
          <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-md">
            { mutation.isError || (mutation.isSuccess && isSignedUp) ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{isSignedUp ? 'Awesome ' :'Uh-oh!'}</strong>
              <span className="block sm:inline">{isSignedUp ? 'User created successfully' : mutation.error?.message}</span>
              <span onClick={() => mutation.reset()} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                <XIcon className="h-6" />  
              </span>
            </div> : null}
          
            <form>
              <div className="mt-4">
                <div>
                  <label className="block">Email</label>
                  <input type="email" placeholder="Email"
                    onChange={(event) => updateForm({ ...form, email: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                  <span className="text-xs tracking-wide text-red-600">{mutation.error?.message}</span>
                </div>
                <div>
                  <label className="block">Fullname</label>
                  <input type="text" placeholder="Fullname"
                    disabled={mutation.isLoading}
                    onChange={(event) => updateForm({ ...form, fullname: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
                <div>
                  <label className="block">Phone Number</label>
                  <input type="number" placeholder="Phone Number"
                    disabled={mutation.isLoading}
                    onChange={(event) => updateForm({ ...form, phone: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
                <div className="mt-4">
                  <label className="block">Password</label>
                  <input 
                    type="password" 
                    placeholder="Password"
                    disabled={mutation.isLoading}
                    onChange={(event) => updateForm({ ...form, password: event.target.value })}
                    className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <button onClick={processSubmit} disabled={mutation.isLoading} className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Register</button>
                  <Link to="/login" className="text-sm text-red-600 hover:underline">Already have an account?</Link>
                </div>
              </div>
            </form>
          </div>
        </> }
      </div>
    </main>
    <Footer />
  </React.Fragment>)
}

export default connect(state => ({ user: state.user }))(Register);