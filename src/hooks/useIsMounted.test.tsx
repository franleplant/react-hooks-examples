import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks'

import useIsMounted from './useIsMounted';


describe('useIsMounted', () => {
  it('detects when the component is mounted', () => {
    const { result } = renderHook(() => useIsMounted())
    const isMounted = result.current
    expect(isMounted.current).toBe(true);
  })

  it('detects when the component is unmounted', () => {
    const { result, unmount } = renderHook(() => useIsMounted())
    unmount()
    const isMounted = result.current
    expect(isMounted.current).toBe(false);
  })
});
