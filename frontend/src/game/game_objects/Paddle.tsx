import React, { useCallback, useContext, useEffect } from 'react'
import { Container, Graphics, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';
import { GameDataCtx } from '../../GameApp';


interface PaddleProps {
  left: boolean;
  stageSize: BoxSize;
  size: BoxSize;
}

function Paddle(props: PaddleProps) {
  const { left, stageSize, size } = props;
  const [rot, setRot] = React.useState(0);
  const [position, setPosition] = React.useState<Offset>({ x: 0, y: 0 });
  const gameTick = useContext(GameDataCtx);
  useTick((delta) => {
    setRot(rot + 5);
  }, false);

  useTick((delta) => {
    if (left) {
      setPosition(gameTick.leftPaddlePosition);
    }
    else {
      setPosition(gameTick.rightPaddlePosition);
    }
  });
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
  }, [position.y]);
  return (
    <Container x={position.x + size.w / 2} y={position.y} pivot={new PIXI.Point(size.w / 2, size.h / 2)} rotation={Math.sin(rot) * 0.05}>
      <Graphics draw={draw} />
    </Container>
  )
}

export default Paddle