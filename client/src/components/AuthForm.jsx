import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import ErrorStyle from "./ErrorStyle";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";

const AuthForm = ({ isLogin }) => {
  const AuthSchema = Yup.object({
    username: isLogin ? null : Yup.string()
      .min(3, "Username must have at least 3 characters.")
      .max(10, "Username must not more than 10 characters.")
      .required("Username is required."),
    email: Yup.string()
      .required("Email is required.")
      .email("Please enter valid email."),
    password: Yup.string()
      .min(3, "Password must have at least 3 characters.")
      .required("Password is required."),
  });

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };
  
  const navigate = useNavigate();

  const {updateToken} = useContext(UserContext);

  const onSubmitHandler = async (values) => {
    if (isLogin) {
      const response = await fetch(`${import.meta.env.VITE_API}/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status === 422) {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.log(data);
        updateToken(data.token);
      toast.success("Login successful.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
    }
    } else {
      const response = await fetch(`${import.meta.env.VITE_API}/register`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status === 422) {
        const errMsg = data.errorDetails[0].msg;
        toast.error(errMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      toast.success("User registration successful.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={AuthSchema}
        onSubmit={onSubmitHandler}
      >
        {({ errors, touched, values }) => (
          <Form>
            <div className="mt-10">
              <h2 className=" font-semibold text-2xl text-center">
                {isLogin ? "Login" : "Register"}
              </h2>
            </div>
            {!isLogin && (
              <div className="mt-6">
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="w-full border border-gray-400 rounded-md block py-1 px-1"
                />
                <ErrorStyle>
                  <ErrorMessage name="username" />
                </ErrorStyle>
              </div>
            )}
            <div className="mt-6">
              <label htmlFor="email">Email</label>
              <Field
                type="text"
                name="email"
                id="email"
                className="w-full border border-gray-400 rounded-md block py-1 px-1"
              />
              <ErrorStyle>
                <ErrorMessage name="email" />
              </ErrorStyle>
            </div>
            <div className="mt-6">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                id="password"
                className="w-full border border-gray-400 rounded-md block py-1 px-1"
              />
              <ErrorStyle>
                <ErrorMessage name="password" />
              </ErrorStyle>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className=" bg-violet-900 text-white py-2 px-4 rounded-sm hover:bg-violet-500"
                title="Save Note"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
            {isLogin ? (
              <div className="mt-8">
                <h4>
                  Don't have an account?{" "}
                  <Link to={"/register"} className=" text-violet-700 underline">
                    Register
                  </Link>
                </h4>
              </div>
            ) : (
              <div className="mt-8">
                <h4>
                  Already have an account?{" "}
                  <Link to={"/login"} className=" text-violet-700 underline">
                    Login
                  </Link>
                </h4>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AuthForm;
