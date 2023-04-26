import React, { useCallback } from 'react'
import { Container, Graphics } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';


interface PaddleProps {
  left: boolean;
  stageSize: BoxSize;
  position: Offset
  size: BoxSize;
}

function Paddle(props: PaddleProps) {
  const { left, stageSize, position, size } = props;

  const draw = useCallback((g: any) => {
    const lightAngle = (position.y - stageSize.h / 2) / 4
    const shadowDirection = left ? -100 : 100;
    const shadowStart = left ? 0 : size.w;
    g.clear();
    g.beginFill(0xFEF8E2);
    g.drawRect(0, 0, size.w, size.h);
    g.endFill();

    g.beginFill(0xFEF8E2, 0.08);
    g.moveTo(shadowStart, 0);
    g.lineTo(shadowStart, size.h);
    g.lineTo(shadowDirection, size.h + lightAngle);
    g.lineTo(shadowDirection, lightAngle);
    g.endFill();

    g.beginFill(0xFEF8E2, 0.08);
    if (lightAngle < 0) {
      g.moveTo(0, 0);
      g.lineTo(size.w, 0);
      g.lineTo(shadowDirection + size.w - shadowStart, lightAngle);
      g.lineTo(shadowDirection - shadowStart, lightAngle);
    }
    else {
      g.moveTo(0, size.h);
      g.lineTo(size.w, size.h);
      g.lineTo(shadowDirection + size.w - shadowStart, size.h + lightAngle);
      g.lineTo(shadowDirection - shadowStart, size.h + lightAngle);
    }
    g.endFill();
  }, [position]);
  return (
    <Container x={position.x} y={position.y - size.h / 2}>
      <Graphics draw={draw} />
    </Container>
  )
}

export default Paddle