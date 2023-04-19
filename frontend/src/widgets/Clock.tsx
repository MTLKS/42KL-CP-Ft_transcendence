import React, { useEffect, useState } from 'react'

const getCurrentTime = () => {
  return new Date().toLocaleTimeString();
}

function Clock() {

  const [clockTime, setClockTime] = useState(getCurrentTime());

  useEffect(() => {
    setInterval(() => setClockTime(getCurrentTime), 100);
  })

  return (
    <div className='absolute top-0 right-0 px-5 py-7 w-fit h-fit bg-highlight rounded-bl-xl font-extrabold text-lg'>
      {clockTime}
    </div>
  )
}

export default Clock