import { Sprite, Text, useApp } from '@pixi/react'
import React, { useMemo } from 'react'
import * as PIXI from 'pixi.js';
import { Offset } from '../../model/GameModels';
import { DropShadowFilter } from 'pixi-filters';

interface GameTextProps {
  position?: Offset;
  text?: string;
  fontSize?: number;
  color?: number;
  opacity?: number;
  anchor?: number | PIXI.Point;
}

function GameText(props: GameTextProps) {
  const { position = { x: 0, y: 0 }, text = "", fontSize = 16, color = 0xFEF8E2, opacity = 1, anchor = 0 } = props;
  const app = useApp();
  const texture = useMemo(() => {
    const textGraphic = new PIXI.Text(text, new PIXI.TextStyle({
      fontFamily: 'JetBrains Mono',
      fontSize: fontSize,
      fill: ['#ffffff'],
    }));
    const box = new PIXI.Graphics();
    box.beginFill(color, opacity);
    box.drawRect(0, 0, textGraphic.width, textGraphic.height);
    box.endFill();

    box.mask = textGraphic;
    const texture = app.renderer.generateTexture(box);
    box.destroy();
    return texture;
  }, [text, fontSize, color, opacity]);


  const filter = useMemo(() => {
    const dropShadowFilter = new DropShadowFilter();
    dropShadowFilter.color = 0xFEF8E2;
    dropShadowFilter.alpha = 0.8;
    dropShadowFilter.blur = 3;
    dropShadowFilter.offset = new PIXI.Point(0, 0);
    dropShadowFilter.padding = 40;
    dropShadowFilter.quality = 5;
    return dropShadowFilter;
  }, []);
  return (
    <Sprite anchor={anchor} x={position.x} y={position.y} texture={texture}
    // filters={[filter]} 
    />
  )
}

export default GameText