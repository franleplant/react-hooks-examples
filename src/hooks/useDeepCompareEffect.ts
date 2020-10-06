import {useRef, useEffect} from "react"




/*
  what is the objective?
  to do the same as useEffect but the dep comparision will be a full deep
  structural comparision using some algorithm (for now a very simple one)

  what is the function interface?
  same as useEffect

  does it return a functiion? is it wrapped into a useCallback? or a ref?
  n/a

  state?
  nothing

  side effects? when? cleanup? do they need refs?
  yes! the same as useEffect but only when the deps change according to
  a deep comparision

  any refs?
  yes! the dependency ref that will only change if the values change
  by the deep equal comparision method

 */
export default function useDeepCompareEffect(callback: React.EffectCallback, deps: Array<any>): void {
  const depsRef = useRef(deps)
  if (!isDeepEqual(deps, depsRef.current)) {
    depsRef.current = deps
  }

  useEffect(callback, depsRef.current)

}

// A very raw deep equality logic
function isDeepEqual<T>(value1: T, value2: T): boolean {
  return JSON.stringify(value1) === JSON.stringify(value2)
}
