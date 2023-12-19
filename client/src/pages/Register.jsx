import React from 'react'
import AuthForm from '../components/AuthForm'

const Register = () => {
  return (
    <div className='px-[40%]'>
        <AuthForm isLogin={false} />
    </div>
  )
}

export default Register