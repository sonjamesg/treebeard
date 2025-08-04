// Updated Carousel for full responsiveness and correct arrow implementation
import React from 'react';
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SlickArrow = ({ onClick, isLeft }) => (
  <div
    onClick={onClick}
    className={cn(
      'absolute z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center top-1/2 -translate-y-1/2 cursor-pointer',
      isLeft ? 'left-2' : 'right-2'
    )}
  >
    {isLeft ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
  </div>
);

const Carousel = ({ media }) => {
  if (!media || media.length === 0) {
    return <div className="text-center text-white p-4">No media to display.</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false // Disable default arrows
  };

  return (
    <div className="relative w-full max-w-full sm:max-w-md mx-auto overflow-hidden">
      <div className="relative">
        <Slider {...sliderSettings}>
          {media.map((item, index) => (
            <div key={index} className="w-full aspect-square bg-black flex items-center justify-center">
              {item.type === 'video' ? (
                <video
                  controls
                  className="w-full h-full object-cover rounded"
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={`media-${index}`}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </Slider>
        {/* Custom arrows overlaid manually */}
        <SlickArrow onClick={() => document.querySelector('.slick-prev')?.click()} isLeft={true} />
        <SlickArrow onClick={() => document.querySelector('.slick-next')?.click()} isLeft={false} />
      </div>
    </div>
  );
};

export default Carousel;
