'use client'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  // Toggle between edit and view modes
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  // Handle image upload
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
      uploadBlog.setFieldValue('profileImage', res.data.url)
      setLoading(false)
      toast.success('Image uploaded successfully!')
    } catch (err) {
      setLoading(false)
      toast.error('Image upload failed!')
    }
  }

  const uploadBlog = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      profileImage: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      setSubmitting(true)
      axios
        .post('http://localhost:5000/user/update', values, {
          headers: {
            'x-auth-token': token,
          },
        })
        .then((result) => {
          toast.success('Saved successfully!')
          resetForm()
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Something went wrong')
          setSubmitting(false)
        })
    },
  })

  return (
    <div className="bg-gradient-to-b from-[#2D2D2D] via-[#1A1A1A] to-[#121212] text-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-8 bg-[#2D2D2D] rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="flex justify-center items-center flex-col">
          {/* Profile Image */}
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

        {/* Form Section for User Details */}
        <form onSubmit={uploadBlog.handleSubmit}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Name</h2>
            {isEditing ? (
              <input
                type="text"
                name="name"
                onChange={uploadBlog.handleChange}
                value={uploadBlog.values.name}
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
                onChange={uploadBlog.handleChange}
                value={uploadBlog.values.email}
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
                onChange={uploadBlog.handleChange}
                value={uploadBlog.values.password}
                className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                placeholder="Enter your password"
              />
            ) : (
              <p>********</p> // Masked password in view mode
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            {isEditing ? (
              <textarea
                name="bio"
                onChange={uploadBlog.handleChange}
                value={uploadBlog.values.bio}
                className="w-full p-4 text-gray-800 bg-gray-200 rounded-md"
                rows="4"
                placeholder="Tell us about yourself"
              />
            ) : (
              <p>{localStorage.getItem('bio') || 'No bio added yet'}</p>
            )}
          </div>

          {/* Actions: Save or Edit */}
          <div className="flex justify-between items-center">
            {isEditing ? (
              <button
                type="submit"
                disabled={uploadBlog.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
              >
                {uploadBlog.isSubmitting ? 'Saving...' : 'Save Changes'}
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
      </div>
    </div>
  )
}

export default ProfilePage
