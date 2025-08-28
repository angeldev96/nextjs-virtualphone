import React, { useState, useEffect } from 'react';
import { BsBatteryFull } from "react-icons/bs";
import { FaSignal } from "react-icons/fa";

const Screen = ({ onMsgClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Inner screen frame */}
      <div className="absolute inset-1 bg-blue-900 rounded-md overflow-hidden">
        {/* Top status bar */}
        <div className="absolute top-2 right-2 flex items-center space-x-2 z-10 text-white">
          {/* Signal */}
          <FaSignal />
        
          {/* Battery */}
          <BsBatteryFull />
        </div>

        {/* Main time */}
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="text-white text-8xl font-extralight tracking-wider leading-none">
            {formattedTime.split(':')[0]}
          </div>
          <div className="text-white text-8xl font-extralight tracking-wider leading-none -mt-2">
            {formattedTime.split(':')[1]}
          </div>
          <div className="text-white text-xs mt-2">{formattedDate}</div>
        </div>

        {/* Messaging Icon */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button onClick={onMsgClick} className="flex flex-col items-center focus:outline-none">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span className="text-white text-xs mt-1">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen;
