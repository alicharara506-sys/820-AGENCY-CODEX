'use client';

import Image from 'next/image';
import { ALGO_ASSET, useAlgo } from './algo-controller';

type Props = { variant?: 'hero' | 'world' | 'contact'; className?: string };

export default function AlgoVisual({ variant = 'world', className = '' }: Props) {
  const { controller } = useAlgo();
  const { x, y } = controller.pointer;
  const transform = `translate3d(${x * (variant === 'hero' ? 12 : 5)}px, ${y * (variant === 'hero' ? 8 : 4)}px, 0) rotateY(${x * 2}deg) rotateX(${-y * 1.5}deg)`;

  return (
    <div className={`algo-visual algo-${variant} is-${controller.state} ${className}`} data-state={controller.state}>
      <div className="algo-radar" aria-hidden="true"><i /><i /><i /></div>
      <div className="algo-crop" style={{ transform }}>
        <Image
          src={ALGO_ASSET.imageUrl}
          alt="ALGO, 820 Agency's curious digital companion"
          fill
          sizes={variant === 'hero' ? '(max-width: 900px) 90vw, 44vw' : '(max-width: 900px) 70vw, 36vw'}
          priority={variant === 'hero'}
          className="algo-source"
        />
      </div>
      <div className="algo-readout" aria-hidden="true"><span /> ALGO / {controller.state.toUpperCase()}</div>
      <div className="algo-expression" aria-hidden="true"><b /><b /></div>
      <div className="algo-nodes" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
  );
}
