import React from "react";

export function useRootClick(cb: () => void) {
  React.useEffect(() => {
    const controller = new AbortController();
    document.documentElement.addEventListener(
      "click",
      () => {
        cb();
      },
      { signal: controller.signal },
    );
    document.documentElement.addEventListener(
      "mousedown",
      (event) => {
        // Prevent selection of text:
        // https://stackoverflow.com/a/43321596
        if (event.detail > 1) {
          event.preventDefault();
        }
      },
      { signal: controller.signal },
    );
    return () => {
      controller.abort();
    };
  }, []);
}
