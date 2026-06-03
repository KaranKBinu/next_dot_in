import { useEffect, RefObject } from "react";

export function useOutsideClick(
    refs: (RefObject<HTMLElement | null> | RefObject<HTMLDivElement | null>)[],
    handler: (event: MouseEvent | TouchEvent) => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            // If the click is inside any of the ignored refs, do nothing
            for (const ref of refs) {
                if (ref.current && ref.current.contains(event.target as Node)) {
                    return;
                }
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [refs, handler]);
}
