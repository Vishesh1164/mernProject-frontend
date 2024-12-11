'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import Card from './Card';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Vlog from './Vlog';

// Dynamically import Swiper components


const Carousal = () => {
  const card = [
 <Card></Card>,
 <Card></Card>,
 <Card></Card>,
 <Card></Card>,

  ];

  return (
    <div className=" max-w-lg mx-auto py-8">
      <Swiper 
      direction='horizontal'
        modules={[Navigation, Pagination,Autoplay,EffectFade]}
        
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        effect='coverflow'
       
      
      >
       {card.map((card, index) =>{
        return (
          <SwiperSlide className=' ' key={index}>
            {card}
          </SwiperSlide>
        )
       })}
      </Swiper>
    </div>
  );
};

export default Carousal;
