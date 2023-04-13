import React, { useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';

interface RecentMatchesProps {
  expanded: boolean;
}

function RecentMatches(props: RecentMatchesProps) {
  const { expanded } = props;
  const maxHeight = 300;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (height == 0 && expanded)
      animateHeight();
    if (height == maxHeight && !expanded)
      setHeight(0);
  }, [expanded]);

  return (
    <div className=' bg-dimshadow mb-1 h-60 w-full transition-all duration-500 ease-in-out'
      style={{ height: height }}
    >

    </div>
  )

  async function animateHeight() {
    await sleep(500);
    setHeight(maxHeight);
  }
}

export default RecentMatches