import React, { useMemo } from 'react'
import * as PIXI from 'pixi.js';
import { Sprite, useApp } from '@pixi/react';

interface BlockProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

function Block(props: BlockProps) {
  const { x, y, w, h } = props;
  const app = useApp();

  const texture = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 1);
    box.drawRoundedRect(0, 0, 200, 200, 30);
    box.endFill();
    const texture = app.renderer.generateTexture(box);
    box.destroy();
    return texture;
  }, []);

  return (
    <Sprite anchor={0.5} x={x} y={y} width={w} height={h} texture={texture} />
  )
}

export default Block