'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Card from '../Components/Card';
import Carousal from '../Components/Carousal';
import Vlog from '../Components/Vlog';
import Testemonial from '../Components/Testemonial';
import Footer from '../Components/Footer';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { IconLoader3 } from '@tabler/icons-react';


const Home = () => {
  const isServer = () => typeof window !== 'undefined';
  const router = useRouter();
  const [latest, setLatest] = useState([]);
  const [thought, setThought] = useState("");
  const [load, setLoad] = useState(false);
  const { ref: featuredRef, inView: featuredInView } = useInView();
  const { ref: thoughtRef, inView: thoughtInView } = useInView();
  const { ref: vlogsRef, inView: vlogsInView } = useInView();

  const fetchBlog = async () => {
    try {
      const res = await axios.get('http://localhost:5000/blog/getall');
      if (res.status === 200) {
        let data = res.data.slice(0, 6);
        setLatest(data);
        setLoad(true);
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const thoughtForm = useFormik({
    initialValues: {
      name: isServer() && localStorage.getItem('name'),
      email: isServer() &&localStorage.getItem('email'),
      thought: '',
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      if (!(isServer() && localStorage.getItem('token'))) {
        toast.error('Please login to send thoughts');
        router.push('/login');
        return;
      }
      console.log(values);

      axios.post('http://localhost:5000/thought/add', values)
        .then((result) => {
          toast.success('Sent successfully');
          resetForm();
          router.push('/');
        }).catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || 'Something went wrong');
          setSubmitting(false);
        });
    }
  });
  useEffect(() => {
    fetchBlog();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } },
  };

  const carouselVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const thoughtCardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const vlogVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const getStarted = () => {
    if (isServer() && localStorage.getItem('email')) {
      router.push('/browse-blogs')
    }
    else {
      router.push('/login')
    }
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">

      <motion.div
        style={{
          backgroundImage: "url('1923a4c2-ed04-4649-b726-b7a3d3d16499.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative h-[90vh] flex flex-col items-center justify-center text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <h1 className="text-6xl font-bold z-10 text-white">
          Welcome to Our Blog
        </h1>

        {/* button get started */}

        <motion.button
          onClick={getStarted}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:translate-x-2 hover:translate-y-2 focus:outline-none focus:ring-4 focus:ring-purple-700"
          whileHover={{
            scale: 1.05,
            translateX: 5,
            translateY: 5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* started button end    */}

      <section ref={featuredRef} className="py-16">
        <h1 className="text-5xl text-center mb-10 font-extrabold text-white">Featured Vlogs</h1>
        <div
          variants={carouselVariants}
          initial="hidden"
          animate={featuredInView ? "visible" : "hidden"}
          className="max-w-lg mx-auto"
        >
          <Carousal blogList={latest} />
        </div>
      </section>

      <section ref={thoughtRef} className="py-16">
        <motion.div
          variants={thoughtCardVariants}
          initial="hidden"
          animate={thoughtInView ? "visible" : "hidden"}
          className="w-[90%] sm:w-[40vw] bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white mx-auto text-center shadow-xl py-8 px-6 rounded-lg"
        >
          <h1 className="text-4xl pb-6 font-bold font-serif">Thought of the Day</h1>
          <q className="block text-lg pb-6 font-serif">
            Some thoughts or inspirational quotes to keep you motivated and focused
          </q>
          <form onSubmit={thoughtForm.handleSubmit}>
            <textarea
              className="mt-4 p-4 text-lg rounded-lg shadow-inner w-full bg-gray-800 text-gray-200"
              id="thought"
              onChange={thoughtForm.handleChange}
              value={thoughtForm.values.thought}
              placeholder="Submit your thought"
            />
            <button
              type='submit'
              className="mt-8 bg-purple-700 hover:bg-purple-900 text-white py-2 px-8 rounded-lg text-lg font-medium shadow-lg"
            >
              {thoughtForm.isSubmitting ? <IconLoader3 className='animate-spin' /> : ''}
              {thoughtForm.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Latest Vlogs Section */}
      <section ref={vlogsRef} className="py-16">
        <h1 className="text-5xl text-center mb-10 font-extrabold text-white">Latest Vlogs</h1>
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={vlogsInView ? "visible" : "hidden"}
        >
          {latest.map((vlog) => (
            <motion.div
              key={vlog._id}
              variants={vlogVariants}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-900 rounded-lg shadow-lg"
            >
              <Vlog
                id={vlog['_id']}
                title={vlog['title']}
                description={vlog['description']}
                cover={vlog['cover']}
                user={vlog['publishedBy']}
                src={vlog['src']}
              />
            </motion.div>
          ))}
        </motion.div>
        <a
          className="block mt-8 text-center text-xl text-blue-400 hover:text-blue-600 cursor-pointer"
          onClick={() => {
            router.push("/browse-blogs");
          }}
        >
          View More
        </a>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <Testemonial />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
