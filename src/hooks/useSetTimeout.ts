import { useEffect, useRef, useCallback } from "react";
import useIsMounted from "./useIsMounted";

export type Callback = () => any;
export type CustomSetTimeout = (callback: Callback, ms: number) => void;

// Safe useSetTimeout (set the timeout whenever you want)
/**
  what is the objective?
  to be able to setTimeout in any place of your component (i.e. handlers)
  in a safe fashion, not worrying about cleaning up timers
  and component mount status

  what is the function interface?
  no params, returns a setTimeout function

  does it return a functiion? is it wrapped into a useCallback? or a ref?
  yes and yes!

  state?
  nothing

  side effects? when?
  cleanup any outstanding timers when the component is unmounted

  any refs?
  yes, the timers that we need to cleanup

 */
export default function useSetTimeout(): CustomSetTimeout {
  const isMounted = useIsMounted();
  const timers = useRef<Array<any>>([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => {
        clearTimeout(timer);
      });
    },
    []
  );

  return useCallback(
    (callback: Callback, ms: number) => {
      function onTimeout() {
        // This is to avoid race conditions when the
        // cleanup callback and the timeout are very close
        // and the timeout callback gets called right before
        // the cleanup callback
        if (isMounted.current) {
          callback();
          // We could potentially remove the timerId from the timers array
          // at this point, what is the benefit?
        }
      }

      const id = setTimeout(onTimeout, ms);
      timers.current.push(id);
    },
    //never changes
    [isMounted]
  );
}
