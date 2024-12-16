'use client'
import axios from 'axios'
import { Formik, useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }


  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'preset2832')
    formData.append('cloud_name', 'dshlv1jgu')
    setLoading(true)

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dshlv1jgu/image/upload',
        formData
      )
      setImage(res.data.url)
      setLoading(false)
      toast.success('Image uploaded successfully!')
    } catch (err) {
      console.log(err);
      setLoading(false)
      toast.error('Image upload failed!')
    }
  };

  const [userData, setUserData] = useState(null)

  const fetchUserData = async () => {
    const res = await axios.get(`http://localhost:5000/user/getuser`, {
      headers: {
        'x-auth-token': token
      }
    })
    console.log(res.data)
    setUserData(res.data)
    setImage(res.data.profileImage)
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const updateForm = async (values) => {
    values.profileImage = image || userData.profileImage  
    console.log(values)

    const res = await axios.put(`http://localhost:5000/user/update`, values, {
      headers: {
        'x-auth-token': token
      }
    })

    if (res.status === 200) {
      toast.success('User updated Successfully')
      setIsEditing(!isEditing)
    }
    else {
      toast.error('some error occured')
    }
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
              {loading && (
                <div className="mt-2 text-blue-500">Uploading...</div>
              )}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">Email</h1>
          <p className="text-gray-400 mb-4">{localStorage.getItem('email')}</p>
        </div>
        {
          userData === null ? <p className='text-center my-5 text-gray-500 font-bold text-2xl'>Loading, please wait...</p>
            : (
              <Formik initialValues={userData} onSubmit={updateForm}>
                {

                  (updateForm) => {
                    return (
                      <form onSubmit={updateForm.handleSubmit}>
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2">Name</h2>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              onChange={updateForm.handleChange}
                              value={updateForm.values.name}
                              className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                              placeholder="Enter your name"
                            />
                          ) : (
                            <p>{localStorage.getItem('name')}</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2">Email</h2>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              onChange={updateForm.handleChange}
                              value={updateForm.values.email}
                              className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                              placeholder="Enter your email"
                            />
                          ) : (
                            <p>{localStorage.getItem('email')}</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2">Password</h2>
                          {isEditing ? (
                            <input
                              type="password"
                              name="password"
                              onChange={updateForm.handleChange}
                              value={updateForm.values.password}
                              className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                              placeholder="Enter your password"
                            />
                          ) : (
                            <p>********</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2">Bio</h2>
                          {isEditing ? (
                            <textarea
                              name="bio"
                              onChange={updateForm.handleChange}
                              value={updateForm.values.bio}
                              className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                              rows="4"
                              placeholder="Tell us about yourself"
                            />
                          ) : (
                            <p>{localStorage.getItem('bio') || 'No bio added yet'}</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          {isEditing ? (
                            <button
                              type="submit"
                              disabled={updateForm.isSubmitting}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                            >
                              {updateForm.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                          ) : (
                            <div
                              onClick={handleEditToggle}
                              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                            >
                              Edit Profile
                            </div>
                          )}
                        </div>
                      </form>
                    )
                  }
                }
              </Formik>
            )
        }

      </div>
    </div>
  )
}

export default ProfilePage
