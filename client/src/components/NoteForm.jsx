import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorStyle from "./ErrorStyle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/UserContext";
import { BeatLoader, ClipLoader } from "react-spinners";

const NoteForm = ({ isCreate }) => {
  const navigate = useNavigate();

  const [oldNote, setOldNote] = useState({});

  const fileRef = useRef();

  const { id } = useParams();

  const [previewImg, setPreviewImg] = useState(null);

  const [isUpload, setIsUpload] = useState(isCreate ? false : true);

  const [loading, setLoading] = useState(false);

  const getOldNote = async () => {
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_API}/edit/${id}`);
    if (response.status == 200) {
      const data = await response.json();
      setOldNote(data);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isCreate) {
      getOldNote();
    }
  }, []);

  const handleImageChange = (event, setFieldValue) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setPreviewImg(URL.createObjectURL(selectedImage));
      setFieldValue("cover_image", selectedImage);
    }
  };

  const clearPreviewImage = (setFieldValue) => {
    setPreviewImg(null);
    setFieldValue("cover_image", null);
    fileRef.current.value = "";
  };

  const initialValues = {
    title: isCreate ? "" : oldNote.title,
    content: isCreate ? "" : oldNote.content,
    note_id: isCreate ? "" : oldNote._id,
    cover_image: isCreate ? null : oldNote.cover_image,
  };

  const SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

  const SignupSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must have at least 3 characters.")
      .max(30, "Title must not more than 30 characters.")
      .required("Title must be required."),
    content: Yup.string()
      .min(10, "Content must have at least 10 characters.")
      .required("Content must be required."),
    cover_image: !isCreate
      ? null
      : Yup.mixed()
          .nullable()
          .test(
            "FILE_FORMAT",
            "File type is not support.",
            (value) => !value || SUPPORTED_FORMATS.includes(value.type)
          ),
  });

  const { token } = useContext(UserContext);

  const onSubmitHandler = async (values) => {
    let API = `${import.meta.env.VITE_API}`;
    let method;
    if (isCreate) {
      API = `${import.meta.env.VITE_API}/create`;
      method = "POST";
    } else {
      API = `${import.meta.env.VITE_API}/edit`;
      method = "PUT";
    }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("cover_image", values.cover_image);
    formData.append("note_id", values.note_id);

    const response = await fetch(API, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    const data = await response.json();
    let alertMsg;
    if (response.status == 201) {
      alertMsg = "New note successfully created!";
    } else if (response.status == 200) {
      alertMsg = "Note was updated!";
    }
    toast.success(alertMsg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    if (response.status == 201 || response.status == 200) {
      navigate("/");
    } else if (response.status == 401) {
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
      alertMsg = "Something went wrong.";
      toast.error(alertMsg, {
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
    <>
      {!loading ? (
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize={true}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form encType="multipart/form-data">
              <div className="flex justify-between mt-10">
                <h2 className=" font-semibold text-2xl">
                  {isCreate ? "Create new note here" : "Edit your note"}
                </h2>
                <Link to={"/"}>
                  <ArrowLeftIcon
                    width={"30"}
                    className="hover:text-violet-600"
                    title="back"
                  />
                </Link>
              </div>
              <div className="mt-6">
                <label htmlFor="title">Note Title</label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="w-full border border-gray-400 rounded-md block py-1 px-1"
                />
                <ErrorStyle>
                  <ErrorMessage name="title" />
                </ErrorStyle>
              </div>
              <div className="mt-6">
                <label htmlFor="content">Note Content</label>
                <Field
                  as="textarea"
                  type="text"
                  name="content"
                  id="content"
                  rows={"10"}
                  className="w-full border border-gray-400 rounded-md block py-1 px-1"
                />
                <ErrorStyle>
                  <ErrorMessage name="content" />
                </ErrorStyle>
              </div>
              <div className="mt-6">
                <div className="flex justify-between">
                  <label htmlFor="cover_image">
                    Cover Image{" "}
                    <span className=" text-black/60 text-[14px]">
                      (optional)
                    </span>
                  </label>
                  {!isUpload && (
                    <PlusIcon
                      width={"25"}
                      onClick={() => setIsUpload(true)}
                      className="cursor-pointer"
                    />
                  )}
                  {isUpload && previewImg && (
                    <span
                      onClick={() => clearPreviewImage(setFieldValue)}
                      className="cursor-pointer"
                    >
                      clear
                    </span>
                  )}
                  {isUpload && !previewImg && (
                    <MinusIcon
                      width={"25"}
                      onClick={() => setIsUpload(false)}
                      className="cursor-pointer"
                    />
                  )}
                </div>
                {isUpload && (
                  <>
                    <input
                      type="file"
                      name="cover_image"
                      id="cover_image"
                      hidden
                      ref={fileRef}
                      onChange={(e) => {
                        handleImageChange(e, setFieldValue);
                      }}
                    />
                    <div className=" border border-dashed border-gray-400 rounded-md flex justify-center h-[200px] relative">
                      <ArrowUpTrayIcon
                        width={"30"}
                        className="cursor-pointer hover:text-black/50 absolute top-[50%] z-20"
                        onClick={() => fileRef.current.click()}
                      />
                      {isCreate ? (
                        <>
                          {previewImg && (
                            <img
                              src={previewImg}
                              alt={"preview"}
                              className=" w-full absolute top-0 left-0 h-full object-cover opacity-80 z-10"
                            />
                          )}
                        </>
                      ) : (
                        <img
                          src={
                            previewImg
                              ? previewImg
                              : `${import.meta.env.VITE_API}/${
                                  oldNote.cover_image
                                }`
                          }
                          alt={"preview"}
                          className=" w-full absolute top-0 left-0 h-full object-cover opacity-80 z-10"
                        />
                      )}
                    </div>
                  </>
                )}
                <ErrorStyle>
                  <ErrorMessage name="cover_image" />
                </ErrorStyle>
              </div>
              {/* <Field type="text" name="id" id="id" hidden /> */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className=" bg-violet-900 text-white py-2 px-4 rounded-sm hover:bg-violet-500"
                  title="Save Note"
                >
                  {isSubmitting ? <BeatLoader color="#fff" size={6} /> : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex justify-center w-full h-[50vh] items-center">
          <ClipLoader color="#7d269d" speedMultiplier={0.7} />
        </div>
      )}
    </>
  );
};

export default NoteForm;
