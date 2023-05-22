import { useContext, useMemo, useRef } from 'react'
import * as PIXI from 'pixi.js';
import { Sprite, useApp, useTick } from '@pixi/react';
import { GameDataCtx } from '../../GameApp';

function InwardShadow() {
  const app = useApp();
  const gameData = useContext(GameDataCtx);
  const topRef = useRef<PIXI.Sprite>(null);
  const bottomRef = useRef<PIXI.Sprite>(null);
  const leftRef = useRef<PIXI.Sprite>(null);
  const rightRef = useRef<PIXI.Sprite>(null);
  const alphaRot = useRef(0);

  useTick(() => {
    if (!topRef.current || !bottomRef.current || !leftRef.current || !rightRef.current) return;
    const alpha = 0.7 + 0.2 * Math.sin(alphaRot.current);
    topRef.current.alpha = alpha;
    bottomRef.current.alpha = alpha;
    leftRef.current.alpha = alpha;
    rightRef.current.alpha = alpha;
    alphaRot.current += 0.01 * gameData.pongSpeed.x;
  }, gameData.gameType === 'death');

  const texture = useMemo(() => {
    let color: number;
    switch (gameData.gameType) {
      case 'death':
        color = 0xAD6454;
        break;
      case 'boring':
        color = 0x242424;
        break;
      case 'standard':
        color = 0x202020;
        break;
      default:
        color = 0x242424;
    }

    const box = new PIXI.Graphics();
    box.drawRect(0, 0, 1, 100);

    for (let i = 0; i < 100; i++) {
      box.beginFill(color, (i / 110) ** 3);
      box.drawRect(0, 100 - i, 1, 1);
      box.endFill();
    }

    const texture = app.renderer.generateTexture(box);
    box.destroy();
    return texture;
  }, [gameData.gameType]);

  return (
    <>
      <Sprite ref={topRef} x={0} y={0} width={1600} height={200} texture={texture} />
      <Sprite ref={bottomRef} x={1600} y={900} width={1600} height={200} texture={texture} angle={180} />
      <Sprite ref={rightRef} x={1600} y={0} width={900} height={200} texture={texture} angle={90} />
      <Sprite ref={leftRef} x={0} y={900} width={900} height={200} texture={texture} angle={270} />
    </>
  )
}

export default InwardShadow