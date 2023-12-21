import React, { useContext, useEffect } from 'react'
import { Outlet, redirect } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import { UserContext } from '../contexts/UserContext'

const Main = () => {
  const { token } = useContext(UserContext);  
  const isLogin = async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/status`, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    console.log(response);
    if(response.status === 401) {
        redirect("/");
    }
  };

  useEffect(() => {
    isLogin();
  }, []);

  return (
    <div>
        <Navbar />
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
        <Outlet />
    </div>
  )
}

export default Main