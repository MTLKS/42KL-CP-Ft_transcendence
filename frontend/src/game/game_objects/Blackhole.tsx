import React, { useContext, useLayoutEffect, useMemo } from 'react'
import * as PIXI from 'pixi.js';
import { Sprite, useApp } from '@pixi/react';
import { GameDataCtx } from '../../GameApp';

interface BlackholeProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

function Blackhole(props: BlackholeProps) {
  const { x, y, w, h } = props;
  const app = useApp();
  const texture = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0x6B5B85, 1);
    box.drawCircle(0, 0, 22);
    box.endFill();
    box.beginFill(0x6B5B85, 0.5);
    box.drawCircle(0, 0, 25);
    box.endFill();
    box.beginFill(0x6B5B85, 0.3);
    box.drawCircle(0, 0, 30);
    box.endFill();
    box.beginFill(0x6B5B85, 0.2);
    box.drawCircle(0, 0, 37);
    box.endFill();
    box.beginFill(0x6B5B85, 0.1);
    box.drawCircle(0, 0, 48);
    box.endFill();
    box.beginFill(0x6B5B85, 0.05);
    box.drawCircle(0, 0, 60);
    box.endFill();
    box.beginFill(0x6B5B85, 0.01);
    box.drawCircle(0, 0, 75);
    box.endFill();
    box.beginFill(0x6B5B85, 1);
    box.drawCircle(0, 0, 20);
    box.endFill();
    box.beginFill(0x050505, 0.1);
    box.drawCircle(0, 0, 20);
    box.endFill();
    box.beginFill(0x050505, 0.2);
    box.drawCircle(0, 0, 16);
    box.endFill();
    box.beginFill(0x050505, 0.5);
    box.drawCircle(0, 0, 14);
    box.endFill();
    box.beginFill(0x050505, 0.5);
    box.drawCircle(0, 0, 13);
    box.endFill();
    const texture = app.renderer.generateTexture(box);
    box.destroy();
    return texture;
  }, []);
  return (
    <Sprite anchor={0.5} x={x} y={y} width={w} height={h} texture={texture} />
  )
}

export default Blackhole