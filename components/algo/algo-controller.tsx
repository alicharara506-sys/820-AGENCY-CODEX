'use client';

import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

export type AlgoState =
  | 'idle' | 'curious' | 'happy' | 'thinking' | 'focused' | 'creative'
  | 'communicating' | 'building' | 'analyzing' | 'loading' | 'success'
  | 'sleeping' | 'awake';

type ControllerState = {
  state: AlgoState;
  pointer: { x: number; y: number };
  activeDiscipline: string;
  activeTool: string;
  message: string;
};

type Action =
  | { type: 'SET_STATE'; state: AlgoState }
  | { type: 'SET_POINTER'; x: number; y: number }
  | { type: 'SET_DISCIPLINE'; discipline: string; state: AlgoState; tool: string; message: string }
  | { type: 'ACTIVATE_TOOL'; tool: string; message: string; state: AlgoState };

const initialState: ControllerState = {
  state: 'awake',
  pointer: { x: 0, y: 0 },
  activeDiscipline: 'Brand',
  activeTool: 'Strategy',
  message: 'Mapping a distinct position.',
};

function reducer(current: ControllerState, action: Action): ControllerState {
  if (action.type === 'SET_STATE') return { ...current, state: action.state };
  if (action.type === 'SET_POINTER') return { ...current, pointer: { x: action.x, y: action.y } };
  if (action.type === 'ACTIVATE_TOOL') return { ...current, activeTool: action.tool, message: action.message, state: action.state };
  return { ...current, activeDiscipline: action.discipline, state: action.state, activeTool: action.tool, message: action.message };
}

const AlgoContext = createContext<{
  controller: ControllerState;
  setState: (state: AlgoState) => void;
  setPointer: (x: number, y: number) => void;
  setDiscipline: (discipline: string, state: AlgoState, tool: string, message: string) => void;
  activateTool: (tool: string, message: string, state: AlgoState) => void;
} | null>(null);

export function AlgoProvider({ children }: { children: React.ReactNode }) {
  const [controller, dispatch] = useReducer(reducer, initialState);
  const setState = useCallback((state: AlgoState) => dispatch({ type: 'SET_STATE', state }), []);
  const setPointer = useCallback((x: number, y: number) => dispatch({ type: 'SET_POINTER', x, y }), []);
  const setDiscipline = useCallback((discipline: string, state: AlgoState, tool: string, message: string) => dispatch({ type: 'SET_DISCIPLINE', discipline, state, tool, message }), []);
  const activateTool = useCallback((tool: string, message: string, state: AlgoState) => dispatch({ type: 'ACTIVATE_TOOL', tool, message, state }), []);
  const value = useMemo(() => ({ controller, setState, setPointer, setDiscipline, activateTool }), [controller, setState, setPointer, setDiscipline, activateTool]);
  return <AlgoContext.Provider value={value}>{children}</AlgoContext.Provider>;
}

export function useAlgo() {
  const value = useContext(AlgoContext);
  if (!value) throw new Error('useAlgo must be used inside AlgoProvider');
  return value;
}

// Production GLB seam: switch mode and provide modelUrl once the approved model ships.
export const ALGO_ASSET = {
  mode: 'model' as 'image' | 'model',
  imageUrl: '/algo-approved.png',
  modelUrl: '/algo-approved.glb' as string | null,
};
