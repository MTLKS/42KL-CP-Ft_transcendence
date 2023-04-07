import React from 'react'

interface ScrollViewProps {
    children: React.ReactNode
}

function SrcollView(props : ScrollViewProps) {
  const { children } = props;
  return (
    <div className=' overflow-y-scroll mt-auto'>
      {children}
    </div>
  )
}

export default SrcollView