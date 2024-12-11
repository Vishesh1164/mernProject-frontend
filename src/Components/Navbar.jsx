'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [login, setLogin] = useState(false)
  let menuCloseTimeout = null

  const toggleLogin = () => {
    if (localStorage.getItem('email')) setLogin(true)
    else setLogin(false)
  }

  const logout = () => {
    localStorage.removeItem('email')
    setLogin(false)
    router.push('/')
  }

  const Login = () => {
    router.push('/login')
  }

  useEffect(() => {
    toggleLogin()
  }, [])

  const handleMouseEnter = () => {
    if (menuCloseTimeout) clearTimeout(menuCloseTimeout)
    setIsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    menuCloseTimeout = setTimeout(() => {
      setIsMenuOpen(false)
    }, 200) // Delay before closing the menu
  }

  return (
    <nav className="bg-black py-3 flex justify-between items-center px-6">
      {/* Logo Section */}
      <h1
        className="text-2xl text-white font-semibold cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
      >
        Developer Vlogs
      </h1>

      {/* Navigation Links */}
      <ul className="flex space-x-8 text-white font-bold">
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/') }}>Home</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/browse-blogs') }}>Blogs</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { login ? router.push('/upload-blog') : router.push('/login') }}>Upload Blog</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/about') }}>About Us</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/contact') }}>Contact Us</li>
      </ul>

      {/* Profile Image and Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />

        {/* Dropdown Menu with Framer Motion */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 bg-[#1c1c1e] border border-gray-700 text-white rounded-md shadow-lg p-3 w-56 z-10"
            >
              <ul className="space-y-2">
                <li
                  className="cursor-pointer p-2 rounded-md flex items-center space-x-2 hover:bg-[#27272a] transition duration-200"
                  onClick={() => { login ? router.push('/user-profile') : router.push('/login') }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A4 4 0 117.634 6.22m8.268 0a4 4 0 011.52 6.784M12 14v6m-3 0h6"
                    />
                  </svg>
                  <span>{login ? 'Profile' : 'Login'}</span>
                </li>
                <li className="cursor-pointer p-2 rounded-md flex items-center space-x-2 hover:bg-[#27272a] transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v4m0 4v4m0 4v4m0-20c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S18.075 4 12 4z"
                    />
                  </svg>
                  <span>Settings</span>
                </li>
                <li
                  className="cursor-pointer p-2 rounded-md flex items-center space-x-2 hover:bg-[#27272a] transition duration-200"
                  onClick={() => { login ? logout() : Login() }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m10 4V8"
                    />
                  </svg>
                  <span>{login ? 'Logout' : 'Login'}</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
