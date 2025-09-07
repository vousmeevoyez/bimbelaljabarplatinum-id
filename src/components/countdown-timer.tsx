"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-2 md:mb-4">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
          Hitung Mundur hingga 8 September 2025
        </h2>
      </div>
 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-2 border-blue-200">
          <div className="text-xl md:text-3xl lg:text-4xl font-bold text-blue-600">
            {formatNumber(timeLeft.days)}
          </div>
          <div className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">
            Hari
          </div>
        </div>
 
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-2 border-green-200">
          <div className="text-xl md:text-3xl lg:text-4xl font-bold text-green-600">
            {formatNumber(timeLeft.hours)}
          </div>
          <div className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">
            Jam
          </div>
        </div>
 
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-2 border-yellow-200">
          <div className="text-xl md:text-3xl lg:text-4xl font-bold text-yellow-600">
            {formatNumber(timeLeft.minutes)}
          </div>
          <div className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">
            Menit
          </div>
        </div>
 
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4 border-2 border-red-200">
          <div className="text-xl md:text-3xl lg:text-4xl font-bold text-red-600">
            {formatNumber(timeLeft.seconds)}
          </div>
          <div className="text-xs md:text-sm lg:text-base text-gray-600 font-medium">
            Detik
          </div>
        </div>
      </div>
    </div>
  );
}
