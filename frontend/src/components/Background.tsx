import React from 'react'

interface ContainerProps {
  children: JSX.Element | JSX.Element[];
};

export function PolkaDotContainer(props: ContainerProps) {
  return (
    <div className="polka-dot">
      {props.children}
    </div>
  )
}
