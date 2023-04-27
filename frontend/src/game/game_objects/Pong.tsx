import React, { useCallback, useEffect, useState } from 'react'
import { Container, Graphics } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';
interface PongProps {
	stageSize: BoxSize;
	position: Offset
	size: BoxSize;
}

let p1: Offset = { x: 0, y: 0 }
let p2: Offset = { x: 0, y: 0 }
let p3: Offset = { x: 0, y: 0 }

function Pong(props: PongProps) {
	const { stageSize, position, size } = props;
	const [particles, setParticles] = useState<JSX.Element[]>([]);
	useEffect(() => {
		setTimeout(() => {
			p3 = p2;
			p2 = p1;
			p1 = position;
		}, 5);
	}, [position]);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setParticles((particles) => {
	// 			if (particles.length > 10) {
	// 				particles.shift();
	// 			}
	// 			return [
	// 				...particles,

	// 			]
	// 		});
	// 	}, 10);
	// 	return () => clearInterval(interval);
	// }, []);

	const draw = useCallback((g: PIXI.Graphics) => {
		g.clear();
		g.beginFill(0xFEF8E2);
		g.drawRect(position.x, position.y, size.w, size.h);
		g.endFill();
		// g.beginFill(0xFEF8E2, 0.6);
		// g.drawRect(p1.x, p1.y, size.w, size.h);
		// g.endFill();
		// g.beginFill(0xFEF8E2, 0.3);
		// g.drawRect(p2.x, p2.y, size.w, size.h);
		// g.endFill();
		// g.beginFill(0xFEF8E2, 0.2);
		// g.drawRect(p3.x, p3.y, size.w, size.h);
		// g.endFill();
	}, [position]);
	return (
		<Graphics draw={draw} />
	)
}

export default Pong