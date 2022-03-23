import { XIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useToken from "../../hooks/useToken";
import backendApi from "../../utils/backendApi";

const Login = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, setToken, clearToken } = useToken();
  
  const [form, updateForm] = useState({email:null, password:null});
  const [redirectCountdown, setCountdown] = useState(5);

  const isLoggedIn = !!(user.email && user.accessToken);

  const mutation = useMutation(function(postData) {
    if(!(postData.email && postData.password)) throw new Error('Fill in all fields');
    return backendApi.signin(postData.email.toLowerCase(), postData.password);
  }, { onSuccess: function(data, variables, context) {
    if(data.status === 1) {
      setToken(data.accessToken);
      dispatch({ type: 'SIGNIN', payload: data });
    } else throw new Error(data.message);
  } });

  const tokenQuery = useQuery('user-token', () => {
    return backendApi.signinToken(token);
  }, { enabled: !!token && !isLoggedIn, onSuccess: function(data) {
    if(data.status === 0) {
      clearToken();
      throw new Error(data.message);
    }
    dispatch({ type: 'SIGNIN', payload: data });
  } })

  const processSubmit = async () => {
    const { email, password } = form;
    mutation.mutate({ email, password })
  }

  useEffect(() => {
    if(isLoggedIn) {
      if(redirectCountdown === 0) {
        setCountdown(null);
        navigate("/dashboard");
      }

      const interval = redirectCountdown > 0 && setInterval(() => setCountdown(redirectCountdown  - 1), 1000) 
      return () => clearInterval(interval);
    }
  }, [redirectCountdown, isLoggedIn, navigate]);

  return(<React.Fragment>
    <Header/>
    {/* main component */}
    <main className="py-5 px-6">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center justify-center dark:text-white">
          { isLoggedIn ? <h3>Redirecting in {redirectCountdown}</h3> : <>
            <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-md">

              { mutation.isError || tokenQuery.isError ? <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Uh-oh!</strong>
                <span className="block sm:inline">{mutation.error?.message || tokenQuery.error?.mesage}</span>
                <span onClick={() => mutation.reset()} className="cursor-pointer absolute top-0 bottom-0 right-0 px-4 py-3">
                  <XIcon className="h-6" />  
                </span>
              </div> : null}

              <form>
                <div className="mt-4 dark:text-white">
                  { tokenQuery.isLoading ? <p className="text-center">Trying to log you in, please wait</p> : null }
                  { mutation.isLoading ? <p className="text-center">Loading...</p> : null}
                  <div>
                      <label className="block">Email</label>
                      <input 
                        type="text" 
                        placeholder="Email"
                        disabled={mutation.isLoading}
                        onChange={(event) => updateForm({ ...form, email: event.target.value })}
                        className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                      <span className="text-xs tracking-wide text-red-600">{mutation.error?.message || tokenQuery.error?.message}</span>
                  </div>

                  <div className="mt-4">
                    <label className="block">Password</label>
                    <input 
                      type="password"
                      disabled={mutation.isLoading}
                      onChange={(event) => updateForm({ ...form, password: event.target.value })}
                      placeholder="Password"
                      className="dark:bg-gray-600 w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-600" />
                  </div>

                  <div className="flex items-baseline justify-between">
                    <button onClick={processSubmit} disabled={mutation.isLoading} type="button" className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">Login</button>
                    <Link to="/register" className="text-sm text-red-600 hover:underline">Don't have an account?</Link>
                  </div>
                </div>
              </form>
            </div>
          </> }
        </div>
      </div>
    </main>
    <Footer />
  </React.Fragment>)
}

export default connect((state) => ({ user: state.user }))(Login);