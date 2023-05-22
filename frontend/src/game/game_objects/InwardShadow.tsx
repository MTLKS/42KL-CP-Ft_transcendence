import React, { useMemo } from 'react'
import * as PIXI from 'pixi.js';
import { Sprite, useApp, useTick } from '@pixi/react';
import alphaMask from '../../../assets/mask/alphaMask.jpeg';

function InwardShadow() {
  const app = useApp();

  useTick(() => {
  });

  const texture = useMemo(() => {
    const box = new PIXI.Graphics();
    box.beginFill(0xAD6454, 1);
    box.drawRect(0, 0, 200, 200);
    const mask = PIXI.Sprite.from(alphaMask);
    box.mask = mask;
    // box.drawRect(0, 0, 200, 45);
    // box.drawRect(0, 0, 200, 40);
    // box.drawRect(0, 0, 200, 35);
    // box.drawRect(0, 0, 200, 30);
    // box.drawRect(0, 0, 200, 25);
    // box.drawRect(0, 0, 200, 20);
    // box.drawRect(0, 0, 200, 15);
    // box.drawRect(0, 0, 200, 10);
    // box.drawRect(0, 0, 200, 5);
    box.endFill();
    const texture = app.renderer.generateTexture(box);
    box.destroy();
    return texture;
  }, []);

  return (
    <>
      <Sprite x={0} y={0} width={1600} height={300} texture={texture} />
    </>
  )
}

export default InwardShadow