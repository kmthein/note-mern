import React, { useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import formatISO9075 from "date-fns/formatISO9075";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";

const Note = ({ note, getAllNotes }) => {
  const { _id, title, content, createdAt, author } = note;

  const navigate = useNavigate();

  const { token } = useContext(UserContext);
  
  const deleteNote = async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/delete/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 204) {
      getAllNotes();
      toast.success("Note deleted!", {
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
  };
  return (
    <div className=" w-[360px] 2xl:w-80 bg-gray-100 border border-t-4 border-t-violet-500 note-box rounded-md">
      <div className="p-4">
        <h2 className=" text-xl font-semibold">{title}</h2>
        <p className="text-sm mt-1">
          {content.slice(0, 70)}
          {content.length > 70 ? "..." : ""}
        </p>
      </div>
      <div className="flex justify-between border-t pt-2 mx-4">
        <div>
          <p className=" text-[13px]">
            {formatISO9075(new Date(createdAt), { representation: "date" })}
          </p>
        </div>
        <div className=" flex justify-end gap-2 mb-4 cursor-pointer">
          <TrashIcon
            width={"22"}
            className="text-red-600 hover:w-[23px]"
            onClick={deleteNote}
            title="delete"
          />
          <Link to={`/edit/${_id}`}>
            <PencilSquareIcon
              width={"22"}
              className="text-blue-800 hover:w-[23px]"
            />
          </Link>
          <Link to={`/post/${_id}`}>
            <EyeIcon width={"22"} className="text-gray-500 hover:w-[23px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Note;
