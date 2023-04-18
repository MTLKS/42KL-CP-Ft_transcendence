import React from 'react'

interface StatusIndicatorProps {
  status: string;
  reverse?: boolean;
}

function StatusIndicator(props: StatusIndicatorProps) {

  const { status, reverse = false } = props;
  let indicatorStyle = `opacity-50 ${reverse ? 'border-dimshadow' : 'border-highlight'}`;

  if (status == "online" || status == 'in-game')
    indicatorStyle = `bg-accGreen`;

  return (
    <div className={`w-full flex ${reverse ? 'flex-row-reverse' : 'flex-row' } items-center`}>
      <p
        className={`lowercase text-xs xl:text-sm font-extrabold w-full ${status === "in-game" ? 'visible' : 'invisible'} opacity-50 ${reverse ? 'text-dimshadow' : 'text-highlight'}`}
      >
        in game
      </p>
      <div className={`rounded-full aspect-square w-5 xl:w-6 ${status === 'offline' ? 'border-[5px] xl:border-[6px]' : ''} ${indicatorStyle} transition-all ease-in-out duration-200`}></div>
    </div>
  )
}

export default StatusIndicator