'use client';

import axios from 'axios';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Userprofile = () => {
  const isClient = () => typeof window !== 'undefined';

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const token = isClient() && localStorage.getItem('token');

  const handleEditToggle = () => setIsEditing(!isEditing);
  const auth = () =>{
    if(!localStorage.getItem('token')){
      toast.custom("Please login first")
      router.push('/login')
  
      return
    }
  }
  
  useEffect(()=>{auth()},[])
  
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
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Image upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/user/getuser', {
        headers: { 'x-auth-token': token },
      });
      setUserData(res.data);
      setImage(res.data.profileImage);
    } catch (err) {
      toast.error('Failed to fetch user data!');
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const updateForm = async (values) => {
    values.profileImage = image || userData?.profileImage;

    try {
      const res = await axios.put('http://localhost:5000/user/update', values, {
        headers: { 'x-auth-token': token },
      });

      if (res.status === 200) {
        toast.success('User updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error('Failed to update user data!');
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading, please wait...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#2D2D2D] via-[#1A1A1A] to-[#121212] text-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-8 bg-[#2D2D2D] rounded-lg shadow-lg">
        <div className="flex justify-center items-center flex-col">
          <img
            src={image || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {isEditing && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="mt-2 text-blue-500"
              />
              {loading && <p className="mt-2 text-blue-500">Uploading...</p>}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400 mb-4">
            {isClient() && localStorage.getItem('email')}
          </p>
        </div>

        <Formik initialValues={userData} onSubmit={updateForm}>
          {({ handleSubmit, handleChange, values, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {['name', 'email', 'password', 'bio'].map((field) => (
                <div key={field} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 capitalize">{field}</h2>
                  {isEditing ? (
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      name={field}
                      onChange={handleChange}
                      value={values[field]}
                      className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                      placeholder={`Enter your ${field}`}
                    />
                  ) : (
                    <p>
                      {field === 'password'
                        ? '********'
                        : userData[field] || `No ${field} provided`}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center">
                {isEditing ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                  >
                    {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Userprofile;
