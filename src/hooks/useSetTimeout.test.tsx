import React from "react";
import { render, wait } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useSetTimeout from "./useSetTimeout";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe.only("useSetTimeout", () => {
  it("works as setTimeout", async () => {
    const { result } = renderHook(() => useSetTimeout());
    const customSetTimeout = result.current;

    const isCalled: Array<boolean> = [];
    const callback = (index: number) => () => {
      isCalled[index] = true;
    };
    const time = 100;

    customSetTimeout(callback(0), time);
    customSetTimeout(callback(1), time);
    customSetTimeout(callback(2), time);

    await wait(() => {
      expect(isCalled[0]).toBe(true);
      expect(isCalled[1]).toBe(true);
      expect(isCalled[2]).toBe(true);
    });
  });

  it("doesn't run when the component is unmounted", async () => {
    const { result, unmount } = renderHook(() => useSetTimeout());
    const customSetTimeout = result.current;

    const isCalled: Array<boolean> = [false, false, false];
    const callback = (index: number) => () => {
      isCalled[index] = true;
    };
    const time = 100;

    customSetTimeout(callback(0), time);
    customSetTimeout(callback(1), time);
    customSetTimeout(callback(2), time);

    unmount();
    // wait for a decent amount of time
    await sleep(time * 2);
    expect(isCalled[0]).toBe(false);
    expect(isCalled[1]).toBe(false);
    expect(isCalled[2]).toBe(false);
  });
});
