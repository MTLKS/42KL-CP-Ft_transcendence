import React, { useMemo } from 'react'
import * as PIXI from 'pixi.js';
import { Container, Sprite, useApp } from '@pixi/react';
import { DropShadowFilter } from 'pixi-filters';

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

  const filter = useMemo(() => {
    const dropShadowFilter = new DropShadowFilter();
    dropShadowFilter.color = 0xFEF8E2;
    dropShadowFilter.alpha = 0.7;
    dropShadowFilter.blur = 4.5;
    dropShadowFilter.offset = new PIXI.Point(10, 5);
    dropShadowFilter.distance = 0;
    dropShadowFilter.padding = 40;
    dropShadowFilter.quality = 5;
    return dropShadowFilter;
  }, []);


  return (
    <Sprite anchor={0.5} x={x} y={y} width={w} height={h} texture={texture} filters={[filter]} />
  )
}

export default Block