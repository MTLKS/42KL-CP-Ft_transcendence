import React from 'react'

interface ScrollViewProps {
  children: React.ReactNode
}

function SrcollView(props: ScrollViewProps) {
  const { children } = props;
  return (
    <div className='overflow-y-auto scroll-m-0 scroll-p-0 scrollbar-hide flex-1 flex flex-col-reverse'>
      {children}
    </div>
  )
}

export default SrcollView