import {useEffect, useRef} from "react";


/*
  what is the objective?
  to get the value of a variable (prop?) from the previous render cycle

  what is the function interface?
  accepts the value we want to store and return the previous value

  does it return a functiion? is it wrapped into a useCallback? or a ref?
  n/a

  state?
  nothing

  side effects? when? cleanup? do they need refs?
  yes, storing the value for the next render cycle, so we need
  to update the value _after_ the component using the hook renders so that
  the component can obtain the previous value
  It will run when the value changes (shallow compare)

  any refs?
  yes! the previous value!

 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

   useEffect(() => {
     ref.current = value
   })

  return ref.current
}
