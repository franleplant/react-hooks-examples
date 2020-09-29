import { useEffect, useRef, MutableRefObject } from "react";

/*
  what is the objective?
  to keep track of the mounted status of the component.
  This cannot be a state because we cannot setState in the unmount cleanup.
  This will help other hoosk and components cleaning or unsetting
  certain side effects when the component unmounts.


  what is the function interface?
  no params, returns a ref to the mounted state.
  Why a ref? because we need to return a "pointer" and the way
  you do that in JS is by using objects or arrays since primitives
  such as booleans are copy by default. useRef is essentially a
  way of forcing a pointer to a value that you can pass around and 
  always referencing a potentially changing value (the mounted state in this case)

  does it return a functiion? is it wrapped into a useCallback? or a ref?
  n/a

  state?
  nothing

  side effects? when? cleanup? do they need refs?
  yes! the mounted state book keeping. 
  This effects runs once and cleanup once.
  It runs after the first render, setting the isMounted ref to true
  and it runs in the unmounted cleanup setting isMounted to false.
  The ref they need is the main isMounted ref that we return and pass around.


  any refs?
  yes, the isMounted one, we covered before.

 */
export default function useIsMounted(): MutableRefObject<boolean> {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
