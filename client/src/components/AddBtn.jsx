import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const AddBtn = () => {
  return (
    <div className="flex justify-end mb-10">
      <Link to={"/create"}>
        <PlusCircleIcon width={"60"} className=" text-violet-900 hover:text-violet-500" title="Add Note"/>
      </Link>
    </div>
  );
};

export default AddBtn;
