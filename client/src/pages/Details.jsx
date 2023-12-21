import React, { useEffect, useState } from "react";
import {
  ArrowUturnLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { ClipLoader, SyncLoader } from "react-spinners";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import formatISO9075 from "date-fns/formatISO9075";

const Details = () => {
  const { id } = useParams();

  const [note, setNote] = useState();

  const [loading, setLoading] = useState(false);

  const getNote = async () => {
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_API}/notes/${id}`);
    const data = await response.json();
    setNote(data);
    setLoading(false);
  };

  useEffect(() => {
    getNote();
  }, []);

  return (
    <div className="px-[20%] 2xl:px-[30%]">
      {!loading && note ? (
        <>
          <div className="flex justify-end mt-10">
            <Link to={"/"}>
              <ArrowUturnLeftIcon
                width={"30"}
                className=" hover:text-violet-600"
                title="back"
              />
            </Link>
          </div>
          <div className=" bg-gray-100 mt-10 border border-t-4 border-t-violet-500 note-box rounded-md">
            <div className="p-4">
              <div className="w-full">
              {note.cover_image && (
                <img
                  src={`${import.meta.env.VITE_API}/${note.cover_image}`}
                  alt="preview"
                  className="mx-auto"
                />
              )}
              </div>
              <h2 className=" text-2xl font-semibold mt-2">{note.title}</h2>
              <p className="text-md mt-3">{note.content}</p>
            </div>
            <div className="flex justify-end px-4 pb-4">
              <div className="text-sm">
                <p className="flex items-center gap-1 justify-end">
                  <UserCircleIcon width={"28"} className=" text-gray-500" />
                  <span className="text-gray-600">{note.author.username}</span>
                </p>
                <p className="flex items-center gap-2 justify-end">
                  <CalendarIcon width={"25"} className=" text-gray-500" />
                  <span className="text-gray-600">
                    {formatISO9075(new Date(note.createdAt), {
                      representation: "date",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center w-full h-[50vh] items-center">
          <ClipLoader color="#7d269d" speedMultiplier={0.7} />
        </div>
      )}
    </div>
  );
};

export default Details;
