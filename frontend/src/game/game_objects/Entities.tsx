import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { GameDataCtx } from '../../GameApp';
import GameEntity, { GameBlackhole, GameTimeZone } from '../../model/GameEntities';
import Blackhole from './Blackhole';
import TimeZone, { TimeZoneType } from './TimeZone';

function Entities() {
  const gameData = useContext(GameDataCtx);

  const entityElements = useMemo(() => {
    return gameData.gameEntities.map((entity, index) => {
      if (entity instanceof GameBlackhole) {
        const { x, y, w, h } = entity;
        return <Blackhole key={index} x={x} y={y} w={w} h={h} />
      }
      if (entity instanceof GameTimeZone) {
        const { x, y, w, h, timeFactor: speedFactor } = entity;
        return <TimeZone key={index} position={{ x, y }} size={{ w, h }} type={speedFactor > 1 ? TimeZoneType.SPEEDUP : TimeZoneType.SLOWDOWN} />
      }
    });
  }, [gameData.gameEntities]);

  return (
    <>
      {entityElements}
    </>
  )
}

export default Entities