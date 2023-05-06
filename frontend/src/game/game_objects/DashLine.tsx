import React, { useCallback } from 'react'
import * as PIXI from 'pixi.js';
import { Graphics } from '@pixi/react';
import { Offset } from '../../modal/GameModels';

declare module 'pixi.js' {
  export interface Graphics {
    drawDashLine(toX: number, toY: number, dash?: number, gap?: number): void;
  }
}

PIXI.Graphics.prototype.drawDashLine = function (toX, toY, dash = 16, gap = 8) {
  const lastPosition = this.currentPath.points;

  const currentPosition = {
    x: lastPosition[lastPosition.length - 2] || 0,
    y: lastPosition[lastPosition.length - 1] || 0
  };

  const absValues = {
    toX: Math.abs(toX),
    toY: Math.abs(toY)
  };

  for (
    ;
    Math.abs(currentPosition.x) < absValues.toX ||
    Math.abs(currentPosition.y) < absValues.toY;
  ) {
    currentPosition.x =
      Math.abs(currentPosition.x + dash) < absValues.toX
        ? currentPosition.x + dash
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + dash) < absValues.toY
        ? currentPosition.y + dash
        : toY;

    this.lineTo(currentPosition.x, currentPosition.y);

    currentPosition.x =
      Math.abs(currentPosition.x + gap) < absValues.toX
        ? currentPosition.x + gap
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + gap) < absValues.toY
        ? currentPosition.y + gap
        : toY;

    this.moveTo(currentPosition.x, currentPosition.y);
  }
};

interface DashLineProps {
  start: Offset;
  end: Offset;
  color?: number;
  dash?: number;
  gap?: number;
  thinkness?: number;
  opacity?: number;
}

function DashLine(props: DashLineProps) {
  const { start, end, color, dash, gap, thinkness, opacity } = props;
  const draw = useCallback((g: PIXI.Graphics) => {
    g.lineStyle(thinkness ?? 2, color ?? 0xffffff, opacity ?? 1);
    g.moveTo(start.x, start.y);
    g.drawDashLine(end.x, end.y, dash, gap);

  }, [start, end, color, dash, gap, thinkness, opacity]);
  return (
    <Graphics draw={draw} />
  )
}

export default DashLine