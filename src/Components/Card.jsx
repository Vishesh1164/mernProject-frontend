'use client'
import React from 'react';
import { motion } from 'framer-motion';

const Card = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="group relative block rounded-xl overflow-hidden shadow-lg bg-gray-800"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {/* Image Section */}
      <div className="relative h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
          alt="Blog Image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 via-transparent text-white">
        <h3 className="text-2xl font-bold group-hover:text-teal-400">
          Facebook is creating a news section in Watch to feature breaking news
        </h3>
        <p className="mt-2 text-gray-300">
          Facebook launched the Watch platform in August
        </p>
      </div>

      {/* Author Section */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-full border-2 border-white"
          src="https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
          alt="Avatar"
        />
        <div>
          <h4 className="text-white font-semibold">Gloria</h4>
          <p className="text-gray-400 text-sm">Jan 09, 2021</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
