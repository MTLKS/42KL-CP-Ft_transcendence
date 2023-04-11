import React from 'react'

interface ButtonProps {
  title: string;
  onClick: () => void;
}

function Button(props: ButtonProps) {
  const { title, onClick } = props;
  return (
    <button className='button' type='button' onClick={onClick}>
      {title}
    </button>
  )
}

export default Button