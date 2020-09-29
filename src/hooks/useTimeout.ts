import { useEffect, useRef, useCallback } from "react";
import useIsMounted from "./useIsMounted";

export type Callback = () => any;

// Safe useTimeout (set the callback right away)
// TODO maybe use null instead of undefined?
/*
  what is the objective?
  to setTimeout safely, automatically cleanup timers when unmounting

  what is the function interface?
  same as window.seTimeout

  does it return a functiion? is it wrapped into a useCallback? or a ref?
  n/a

  state?
  nothing

  side effects? when? cleanup? do they need refs?
  two
  - we setup a callbackRef to keep a stable reference
    to the callback passed as parameter, this to avoid
    re running the main side effect when the callback changes,
    since it doesn't make sense from the "business logic" of this
    hook. We want to update the ref everytime the callback changes.
    Users might want to wrap the callback in a stable ref themselves
    to demonstrate they are providing an immutable function reference throught time
    and as a good practice.

  - the main effect: we set the timeout everytime the ms param changes,
  TODO explain why, we also run a cleanup of the previously set timer whenever
  that happens. We also need a ref to keep track of the timer id. We also
  check that the component is effectively mounted before runing the callback
  to avoid certain race conditions I got in practice.

  cleanup any outstanding timers when the component is unmounted

  any refs?
  yes, the callbackRef, the isMounted and the timerId ref

 */
export function useTimeout(callback: Callback, ms: number | undefined) {
  // Store a stable ref to the callback, we really
  // do not want to reset the timer when the callback changes.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const isMounted = useIsMounted();
  const id = useRef<any>();
  useEffect(() => {
    function onTimeout() {
      // This is to avoid race conditions when the
      // cleanup callback and the timeout are very close
      // and the timeout callback gets called right before
      // the cleanup callback
      if (isMounted.current) {
        callbackRef.current();
      }
    }

    if (ms !== undefined) {
      id.current = setTimeout(onTimeout, ms);
      return () => clearTimeout(id.current);
    }
  }, [isMounted, ms]);
}
