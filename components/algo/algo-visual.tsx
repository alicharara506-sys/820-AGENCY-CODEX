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
      {variant === 'world' && (
        <div className="algo-output" aria-live="polite">
          <span>{controller.activeDiscipline} / {controller.activeTool}</span>
          <p>{controller.message}</p>
        </div>
      )}
      <div className="algo-expression" aria-hidden="true"><b /><b /></div>
      <div className="algo-nodes" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
  );
}

const guideMessages: Record<string, string> = {
  awake: 'I’m awake. Let’s find the useful signal.',
  curious: 'I’m observing the problem before choosing the path.',
  thinking: 'I’m connecting context, priorities, and possibility.',
  creative: 'I’m shaping the idea into a distinctive system.',
  communicating: 'I’m tuning the message for the right attention.',
  building: 'I’m assembling the experience one layer at a time.',
  focused: 'I’m inspecting the work—not the claims.',
  analyzing: 'I’m turning signals into decisions.',
  happy: 'This is where we turn the problem into a project.',
  success: 'Brief ready. That deserves a small celebration.',
};

export function AlgoGuide({ visible }: { visible: boolean }) {
  const { controller } = useAlgo();
  return (
    <a className="algo-guide" data-visible={visible} href="#contact" aria-label={`ALGO says: ${guideMessages[controller.state] ?? controller.message}. Start a project.`}>
      <span className="guide-face" aria-hidden="true">
        <Image src={ALGO_ASSET.imageUrl} alt="" fill sizes="72px" />
      </span>
      <span className="guide-copy"><b>ALGO / {controller.state}</b>{guideMessages[controller.state] ?? controller.message}</span>
      <span className="guide-arrow" aria-hidden="true">↘</span>
    </a>
  );
}
