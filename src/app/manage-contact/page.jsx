'use client'
import { IconCarCrash, IconPencil, IconTrash } from '@tabler/icons-react'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Managecontact = () => {

  const [contactList, setcontactList] = useState([])
  const [loading, setloading] = useState(false)
  const fetchcontacts = async () =>{
    setloading(true)
    // fetch contacts from your server here
    const res= await axios.get('http://localhost:5000/contact/getall')
    console.log(res.data)
    setcontactList(res.data)
    setloading(false)
   
  }
  useEffect(()=>{
    fetchcontacts()
  },[])
  const deletecontact = async (id)=>{

    if(!confirm('Are you sure you want to delete')) return

    const res = await axios.delete(`http://localhost:5000/contact/delete/${id}`)
    if(res.status===200){
      fetchcontacts(res)
       toast.success('contact deleted successfully')
    }
    else{
      toast.error('Failed to delete contact')
    }
    
  }
  return (
    <div className='h-screen bg-gray-200'>
      <h1 className='text-center text-3xl  font-bold '>Manage Contactus Form</h1>
      <div className="container mx-auto"></div>
          {
            loading? <p className='text-center text-gray-500 text-2xl font-bold'>Loading... Please Wait</p>
            :(
              <table className='w-full my-10'>
                <thead className='border-2 border-slate-800 text-white bg-slate-800'>
                  <tr className='border-2 border-slate-700'>
                  <th className='p-2'>ID</th>
                  <th className='p-2'>Name</th>
                  <th className='p-2'>Email</th>
                  <th className='p-2'>Message</th>
                  <th className='p-2'>Sent At</th>
                  <th className='p-2' colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    contactList.map( (contact)=>{
                      return <tr key={contact._id} className='border border-slate-800'>
                         <td className='border text-black border-slate-800 px-1'>{contact._id}</td>
                        <td className='border text-black border-slate-800 px-1'>{contact.name}</td>
                        <td className='border text-black border-slate-800 px-1'>{contact.email}</td>
                        <td className='border text-black border-slate-800 px-1'>{contact.message}</td>
                        <td className='border text-black border-slate-800 px-1'>{contact.createdAt}</td>
                        <td>
                          <button className='bg-red-500 text-white px-2 py-1 rounded-full' onClick={()=>{deletecontact(contact._id)}}><IconTrash/></button>
                        </td>
                        <td>
                          <Link href={'/viewcontact/'+ contact._id} className='bg-blue-500 text-white px-2 py-1 rounded-full block w-fit'><IconPencil/></Link>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            )
          }
    </div>
  )
}

export default Managecontact