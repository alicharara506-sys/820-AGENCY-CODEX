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
};

type Action =
  | { type: 'SET_STATE'; state: AlgoState }
  | { type: 'SET_POINTER'; x: number; y: number }
  | { type: 'SET_DISCIPLINE'; discipline: string; state: AlgoState };

const initialState: ControllerState = { state: 'awake', pointer: { x: 0, y: 0 }, activeDiscipline: 'Brand' };

function reducer(current: ControllerState, action: Action): ControllerState {
  if (action.type === 'SET_STATE') return { ...current, state: action.state };
  if (action.type === 'SET_POINTER') return { ...current, pointer: { x: action.x, y: action.y } };
  return { ...current, activeDiscipline: action.discipline, state: action.state };
}

const AlgoContext = createContext<{
  controller: ControllerState;
  setState: (state: AlgoState) => void;
  setPointer: (x: number, y: number) => void;
  setDiscipline: (discipline: string, state: AlgoState) => void;
} | null>(null);

export function AlgoProvider({ children }: { children: React.ReactNode }) {
  const [controller, dispatch] = useReducer(reducer, initialState);
  const setState = useCallback((state: AlgoState) => dispatch({ type: 'SET_STATE', state }), []);
  const setPointer = useCallback((x: number, y: number) => dispatch({ type: 'SET_POINTER', x, y }), []);
  const setDiscipline = useCallback((discipline: string, state: AlgoState) => dispatch({ type: 'SET_DISCIPLINE', discipline, state }), []);
  const value = useMemo(() => ({ controller, setState, setPointer, setDiscipline }), [controller, setState, setPointer, setDiscipline]);
  return <AlgoContext.Provider value={value}>{children}</AlgoContext.Provider>;
}

export function useAlgo() {
  const value = useContext(AlgoContext);
  if (!value) throw new Error('useAlgo must be used inside AlgoProvider');
  return value;
}

// Production GLB seam: switch mode and provide modelUrl once the approved model ships.
export const ALGO_ASSET = {
  mode: 'image' as 'image' | 'model',
  imageUrl: '/algo-reference.png',
  modelUrl: null as string | null,
};
