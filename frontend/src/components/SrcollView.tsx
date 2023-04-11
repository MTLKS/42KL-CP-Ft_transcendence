import React from 'react'

interface ScrollViewProps {
  children: React.ReactNode;
  reverse?: boolean;
}

function SrcollView(props: ScrollViewProps) {
  const { children, reverse } = props;
  return (
    <div className= {reverse? 'overflow-y-auto scroll-m-0 scroll-p-0 scrollbar-hide flex-1 flex flex-col-reverse':'overflow-y-auto scroll-m-0 scroll-p-0 scrollbar-hide flex-1 flex flex-col' }>
      {children}
    </div>
  )
}

export default SrcollView