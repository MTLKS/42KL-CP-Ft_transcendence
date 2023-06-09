import React, { useEffect, useState } from 'react'

const getCurrentTime = () => {
  return new Date().toLocaleTimeString();
}

function Clock() {

  const [clockTime, setClockTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => setClockTime(getCurrentTime), 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className='px-5 py-7 w-fit h-fit bg-highlight rounded-bl-xl font-extrabold text-lg'>
      {clockTime}
    </div>
  )
}

export default Clock