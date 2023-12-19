import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  const { token } = useContext(UserContext);
  return (
    <div className="bg-violet-900 text-white py-6">
      <div className=" px-[20%] flex justify-between items-center">
        <Link to="/">
          <span className=" text-4xl font-semibold">NOTES</span>
        </Link>
        {
          !token && (
            <div className="flex gap-8">
            <Link to={"/login"} className=" hover:text-gray-300">Login</Link>
            <Link to={"/register"} className=" hover:text-gray-300">Register</Link>
          </div>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
