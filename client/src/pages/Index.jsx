import React, { useContext, useEffect, useState } from "react";
import Note from "../components/Note";
import AddBtn from "../components/AddBtn";
import { SyncLoader } from "react-spinners";
import { UserContext } from "../contexts/UserContext";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getAllNotes = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/notes?page=${pageNum}`
      )
      const { notes, totalNotes, totalPages } = await response.json();
      setNotes(notes);
      setTotalPage(totalPages);
      setLoading(false);      
    } catch (error) {
      setLoading(false);
    }

  };

  useEffect(() => {
    getAllNotes(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const { token } = useContext(UserContext);
  return (
    <div className="px-[20%]">
      <div className="">
      <div className="flex flex-wrap gap-20 2xl:gap-20 py-20">
        {!loading || notes.length > 0 ? (
          <>
            {notes.map((note) => (
              <Note key={note._id} note={note} getAllNotes={getAllNotes} />
            ))}
          </>
        ) : (
          <div className="flex justify-center w-full h-[50vh] items-center">
            <SyncLoader color="#7d269d" speedMultiplier={0.7} />
          </div>
        )}
        {
          !loading && notes.length == 0 &&
          <div className="flex justify-center w-full h-[50vh] items-center">
            <p>Notes not found.</p>
          </div>
        }
      </div>
      </div>
      {!loading && notes.length > 0 && (
        <div className="flex gap-4 justify-center mb-8">
          {currentPage > 1 && (
            <span
              className=" bg-violet-900 text-white p-2 cursor-pointer hover:bg-violet-800"
              onClick={handlePrev}
            >
              Prev Page
            </span>
          )}
          {currentPage < totalPage && (
            <span
              className=" bg-violet-900 text-white p-2 cursor-pointer hover:bg-violet-800"
              onClick={handleNext}
            >
              Next Page
            </span>
          )}
        </div>
      )}
      { token && <AddBtn />}
    </div>
  );
};

export default Index;
