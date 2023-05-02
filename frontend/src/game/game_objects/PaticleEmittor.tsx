import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Container, Graphics, ParticleContainer, PixiComponent, Sprite, useApp, useTick } from '@pixi/react'
import { BoxSize, Offset } from '../../modal/GameModels';
import * as PIXI from 'pixi.js';
import * as particles from '@pixi/particle-emitter'

interface ParticleProps {
  position: Offset
  size: BoxSize;
  speed: Offset;
  color: number;
  container: PIXI.ParticleContainer;
}

const Emitter = PixiComponent<ParticleProps, PIXI.ParticleContainer>('Emitter', {
  create: props => {
    const { position, size, speed, color, container } = props;


    return container;
  },
  applyProps: (instance, _, props) => {
    const { position } = props;
    console.log("create");
    instance.position.set(position.x, position.y);
  }
});

let texture1: PIXI.Texture;
function PaticleEmittor() {
  const [emitter, setEmitter] = useState<particles.Emitter>();
  const [container, setContainer] = useState<PIXI.ParticleContainer>(new PIXI.ParticleContainer());
  const app = useApp();

  useEffect(() => {

    const box = new PIXI.Graphics();
    box.beginFill(0xFEF8E2, 0.8);
    box.drawRect(0, 0, 8, 8);
    box.endFill();
    texture1 = app.renderer.generateTexture(box);
    emitter?.destroy();

    const emitterContainer = new PIXI.ParticleContainer(1000,
      {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
      });
    const newEmitter = new particles.Emitter(
      emitterContainer,
      {
        lifetime: {
          min: 1,
          max: 0.5
        },
        frequency: 0.001,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 1,
        maxParticles: 500,
        pos: {
          x: 10,
          y: 10
        },
        addAtBack: false,
        behaviors: [
          {
            type: 'alpha',
            config: {
              alpha: {
                list: [
                  {
                    value: 1,
                    time: 0
                  },
                  {
                    value: 0,
                    time: 1
                  }
                ],
              },
            }
          },
          {
            type: 'scale',
            config: {
              scale: {
                list: [
                  {
                    value: 1,
                    time: 0
                  },
                  {
                    value: 0.3,
                    time: 1
                  }
                ],
              },
            }
          },
          {
            type: 'color',
            config: {
              color: {
                list: [
                  {
                    value: "ffffff",
                    time: 0
                  },
                  {
                    value: "000000",
                    time: 1
                  }
                ],
              },
            }
          },
          {
            type: 'moveSpeed',
            config: {
              speed: {
                list: [
                  {
                    value: 200,
                    time: 0
                  },
                  {
                    value: 100,
                    time: 1
                  }
                ],
                isStepped: false
              },
            }
          },
          {
            type: 'textureSingle',
            config: {
              texture: texture1
            }
          }
        ],
      }
    );

    newEmitter.emit = true;
    console.log("newEmitter", newEmitter);
    newEmitter.autoUpdate = true;
    setEmitter(newEmitter);
    setContainer(emitterContainer);
  }, []);

  useTick((delta) => {
    if (emitter) {
      emitter.update(delta * 0.001);
    }
  });

  return (
    <Emitter position={{ x: 100, y: 100 }} size={{ w: 100, h: 100 }} speed={{ x: 10, y: 10 }} color={1} container={container} />
  );
}

export default PaticleEmittor