'use client'
import MarkdownEditor from '@uiw/react-markdown-editor';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // For animations

const UploadBlog = () => {
  const [contentValue, setContentValue] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const uploadBlog = useFormik({
    initialValues: {
      title: '',
      description: '',
      cover: '',
      content: '',
      publishedBy: '',
      email:'',
      user:localStorage.getItem('name'),
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      values.content = contentValue;
      values.email = localStorage.getItem('email');
      setSubmitting(true);
      axios
        .post('http://localhost:5000/blog/add', values, {
          headers: {
            'x-auth-token' : token
          }
        })
        .then((result) => {
          toast.success('Blog uploaded successfully!');
          resetForm();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Something went wrong');
          setSubmitting(false);
        });
    },
  });

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset2832');
    formData.append('cloud_name', 'dshlv1jgu');
    setLoading(true);
  

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dshlv1jgu/image/upload',
        formData
      );
      setImage(res.data.url);
      uploadBlog.setFieldValue('cover', res.data.url);
      setLoading(false);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setLoading(false);
      toast.error('Image upload failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
      <motion.div
        className="w-full max-w-5xl bg-gray-800 shadow-xl rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-100">
          Upload Blog
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Image Upload Area */}
          <div className="flex-1 bg-gray-700 p-6 border-2 border-dashed border-gray-600 rounded-xl">
            <label htmlFor="image" className="cursor-pointer text-lg text-gray-400">
              <div className="text-center">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto" />
                  </div>
                ) : image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-500">Click to upload an image</span>
                )}
              </div>
              <input
                type="file"
                id="image"
                onChange={uploadImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Blog Form */}
          <div className="flex-1">
            <form onSubmit={uploadBlog.handleSubmit} className="space-y-6">
              {/* Title Input */}
              <input
                type="text"
                id="title"
                placeholder="Blog Title"
                value={uploadBlog.values.title}
                onChange={uploadBlog.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />

              {/* Description Input */}
              <input
                type="text"
                id="description"
                placeholder="Description"
                value={uploadBlog.values.description}
                onChange={uploadBlog.handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />

              {/* Markdown Editor with scroll */}
              <div className="space-y-4">
                <div className="relative">
                  <MarkdownEditor
                    value={contentValue}
                    onChange={setContentValue}
                    className="rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 text-gray-200"
                    minHeight={200}
                    maxHeight={500} // Set max height for the editor
                    width={20}
                    style={{
                      maxHeight: '400px', // Ensures a scrollable editor area
                      overflowY: 'auto',
                    }}
                  />
                </div>
              </div>

              {/* Upload Button */}
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={uploadBlog.isSubmitting}
              >
                {uploadBlog.isSubmitting ? 'Uploading...' : 'Upload Blog'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadBlog;
