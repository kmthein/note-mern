import React from 'react'
import AuthForm from '../components/AuthForm'

const Login = () => {
  return (
    <div className='px-[40%]'>
        <AuthForm isLogin={true} />
    </div>
  )
}

export default Login