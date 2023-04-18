import React from 'react'

interface StatusIndicatorProps {
  status: string;
  reverse?: boolean;
}

function StatusIndicator(props: StatusIndicatorProps) {

  const { status, reverse = false } = props;
  let indicatorColor = `accGreen`;

  return (
    <div className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row' } items-center gap-x-3`}>
      <p
        className={`lowercase text-xs xl:text-sm font-extrabold w-full ${status === "in-game" ? '' : ''} opacity-50 ${reverse ? 'text-dimshadow' : 'text-highlight'}`}
      >
        in game
      </p>
      <div className={`rounded-full aspect-square w-5 xl:w-7 bg-${indicatorColor}`}></div>
    </div>
  )
}

export default StatusIndicator