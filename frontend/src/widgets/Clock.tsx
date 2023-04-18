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
    <div className='px-5 py-7 w-fit h-fit bg-highlight rounded-bl-3xl font-extrabold'>
      {clockTime}
    </div>
  )
}

export default Clock