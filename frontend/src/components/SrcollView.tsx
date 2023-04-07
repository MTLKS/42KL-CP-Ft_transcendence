import React from 'react'

interface ScrollViewProps {
  children: React.ReactNode
}

function SrcollView(props: ScrollViewProps) {
  const { children } = props;
  return (
    <div className=' overflow-y-scroll scroll-m-0 scroll-p-0 mt-auto scrollbar-hide'>
      {children}
    </div>
  )
}

export default SrcollView