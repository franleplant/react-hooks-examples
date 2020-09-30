import React from "react";
import { render, wait } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useTimeout from "./useTimeout";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("useTimeout", () => {
  it("works as useTimeout", async () => {
    let isCalled = false;
    const callback = () => {
      isCalled = true;
    };
    const time = 100;
    const { result } = renderHook(() => useTimeout(callback, time));

    await wait(() => expect(isCalled).toBe(true));
  });

  it("doesn't run when the component is unmounted", async () => {
    let isCalled = false;
    const callback = () => {
      isCalled = true;
    };
    const time = 100;
    const { result, unmount } = renderHook(() => useTimeout(callback, time));

    unmount();
    // wait for a decent amount of time
    await sleep(time * 2);
    expect(isCalled).toBe(false);
  });

  it("doesn't reset timer when callback changes", async () => {
    let isCalled = false;
    let callback = () => {};
    const time = 100;
    const { result, rerender } = renderHook(() => useTimeout(callback, time));
    callback = () => {
      isCalled = true;
    };
    rerender();
    // wait for the timer plus some minimal offset
    await sleep(time + 10);

    expect(isCalled).toBe(true);
  });

  it("resets timer when the time changes", async () => {
    let isCalled = false;
    const callback = () => {
      isCalled = true;
    };
    let time = 100;
    const { result, rerender } = renderHook(() => useTimeout(callback, time));
    // set the time so that the previous timer is cleared
    // and the new one is called faster
    time = 1;
    rerender();

    // we wait for the new time plus some minimal offset
    await sleep(time + 10);
    expect(isCalled).toBe(true);
  });

  it("clears the timer and doesn't set a new one when the time is undefined", async () => {
    let isCalled = false;
    const callback = () => {
      isCalled = true;
    };
    const originalTime = 100;
    let time = originalTime;
    const { result, rerender } = renderHook(() => useTimeout(callback, time));
    time = undefined;
    rerender();

    // we wait for the new time plus some minimal offset
    await sleep(originalTime + 10);
    expect(isCalled).toBe(false);
  });
});
