import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Container, Graphics, useTick, useApp, Sprite } from '@pixi/react';
import { BoxSize, Offset } from '../../model/GameModels';
import * as PIXI from 'pixi.js';
import { GameData } from '../gameData';
import { GameDataCtx } from '../../GameApp';
interface PongProps {
	position: Offset
	size: BoxSize;
}

function Pong(props: PongProps) {
	const { size, position } = props;
	const app = useApp();

	const texture = useMemo(() => {
		const g = new PIXI.Graphics();
		g.beginFill(0xFEF8E2);
		g.drawRect(0, 0, size.w, size.h);
		g.endFill();
		return app.renderer.generateTexture(g);
	}, [size]);

	return (
		<Sprite x={position.x} y={position.y} width={size.w} height={size.h} texture={texture} />
	)
}

export default Pong