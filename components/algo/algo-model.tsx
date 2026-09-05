'use client';

import { useAlgo } from './algo-controller';

/** Dependency-free CSS 3D fallback for environments without a GLB/WebGL asset. */
export default function AlgoModel() {
  const { controller } = useAlgo();
  const state = controller.state;
  return (
    <div className="algo-model" data-state={state} role="img" aria-label="ALGO, an interactive 3D robot">
      <div className="algo-model-rig">
        <div className="algo-model-antenna"><i /></div>
        <div className="algo-model-head"><div className="algo-model-face"><i /><i /></div><b>820</b></div>
        <div className="algo-model-body"><span /><span /><em>ALGO</em></div>
        <div className="algo-model-arm algo-model-arm-left"><i /><b /></div>
        <div className="algo-model-arm algo-model-arm-right"><i /><b /></div>
        <div className="algo-model-leg algo-model-leg-left" /><div className="algo-model-leg algo-model-leg-right" />
      </div>
    </div>
  );
}
