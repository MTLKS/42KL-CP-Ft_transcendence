import React from 'react'

interface StatusIndicatorProps {
  status: string;
  invert?: boolean;
}

function StatusIndicator(props: StatusIndicatorProps) {

  const { status, invert = false } = props;
  let indicatorStyle = `opacity-50 border-[5px] xl:border-[6px] ${invert ? 'border-highlight' : 'border-dimshadow'}`;

  if (status == "online" || status == 'ingame')
    indicatorStyle = `bg-accGreen`;

  return (
    <div className={`w-full flex flex-row-reverse items-center gap-2`}>
      <p
        className={`lowercase text-md font-extrabold w-full opacity-50 ${invert ? 'text-highlight' : 'text-dimshadow'}`}
      >
        {status === 'ingame' ? 'in-game' : status}
      </p>
      <div className={`rounded-full aspect-square w-6 xl:w-6 ${status === 'offline' ? 'border-[5px] xl:border-[6px]' : ''} ${indicatorStyle} transition-all ease-in-out duration-200`}></div>
    </div>
  )
}

export default StatusIndicator