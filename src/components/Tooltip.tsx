"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export type TooltipPlacement =
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";

interface TooltipProps {
    content: React.ReactNode;
    placement?: TooltipPlacement;
    delay?: number; // Delay in ms before showing
    children: React.ReactElement<any>; // Must be a single React element
    className?: string;
}

const originClasses: Record<TooltipPlacement, string> = {
    top: "origin-bottom",
    "top-start": "origin-bottom-left",
    "top-end": "origin-bottom-right",
    bottom: "origin-top",
    "bottom-start": "origin-top-left",
    "bottom-end": "origin-top-right",
    left: "origin-right",
    "left-start": "origin-top-right",
    "left-end": "origin-bottom-right",
    right: "origin-left",
    "right-start": "origin-top-left",
    "right-end": "origin-bottom-left",
};

const arrowClasses: Record<TooltipPlacement, string> = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b",
    "top-start": "bottom-0 left-3 translate-y-1/2 border-r border-b",
    "top-end": "bottom-0 right-3 translate-y-1/2 border-r border-b",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t",
    "bottom-start": "top-0 left-3 -translate-y-1/2 border-l border-t",
    "bottom-end": "top-0 right-3 -translate-y-1/2 border-l border-t",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r",
    "left-start": "right-0 top-2.5 translate-x-1/2 border-t border-r",
    "left-end": "right-0 bottom-2.5 translate-x-1/2 border-t border-r",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l",
    "right-start": "left-0 top-2.5 -translate-x-1/2 border-b border-l",
    "right-end": "left-0 bottom-2.5 -translate-x-1/2 border-b border-l",
};

export default function Tooltip({
    content,
    placement = "top",
    delay = 100,
    children,
    className = "",
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [id, setId] = useState("");
    const [coords, setCoords] = useState({ top: 0, left: 0, translate: "" });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        setId(`tooltip-${Math.random().toString(36).substring(2, 9)}`);
    }, []);

    const updatePosition = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const gap = 8;
        let top = 0;
        let left = 0;
        let translate = "";

        switch (placement) {
            case "top":
                top = rect.top + window.scrollY;
                left = rect.left + window.scrollX + rect.width / 2;
                translate = `translate(-50%, -100%) translateY(-${gap}px)`;
                break;
            case "top-start":
                top = rect.top + window.scrollY;
                left = rect.left + window.scrollX;
                translate = `translate(0, -100%) translateY(-${gap}px)`;
                break;
            case "top-end":
                top = rect.top + window.scrollY;
                left = rect.left + window.scrollX + rect.width;
                translate = `translate(-100%, -100%) translateY(-${gap}px)`;
                break;
            case "bottom":
                top = rect.top + window.scrollY + rect.height;
                left = rect.left + window.scrollX + rect.width / 2;
                translate = `translate(-50%, 0) translateY(${gap}px)`;
                break;
            case "bottom-start":
                top = rect.top + window.scrollY + rect.height;
                left = rect.left + window.scrollX;
                translate = `translate(0, 0) translateY(${gap}px)`;
                break;
            case "bottom-end":
                top = rect.top + window.scrollY + rect.height;
                left = rect.left + window.scrollX + rect.width;
                translate = `translate(-100%, 0) translateY(${gap}px)`;
                break;
            case "left":
                top = rect.top + window.scrollY + rect.height / 2;
                left = rect.left + window.scrollX;
                translate = `translate(-100%, -50%) translateX(-${gap}px)`;
                break;
            case "left-start":
                top = rect.top + window.scrollY;
                left = rect.left + window.scrollX;
                translate = `translate(-100%, 0) translateX(-${gap}px)`;
                break;
            case "left-end":
                top = rect.top + window.scrollY + rect.height;
                left = rect.left + window.scrollX;
                translate = `translate(-100%, -100%) translateX(-${gap}px)`;
                break;
            case "right":
                top = rect.top + window.scrollY + rect.height / 2;
                left = rect.left + window.scrollX + rect.width;
                translate = `translate(0, -50%) translateX(${gap}px)`;
                break;
            case "right-start":
                top = rect.top + window.scrollY;
                left = rect.left + window.scrollX + rect.width;
                translate = `translate(0, 0) translateX(${gap}px)`;
                break;
            case "right-end":
                top = rect.top + window.scrollY + rect.height;
                left = rect.left + window.scrollX + rect.width;
                translate = `translate(0, -100%) translateX(${gap}px)`;
                break;
        }

        setCoords({ top, left, translate });
    };

    const showTooltip = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
        updatePosition(e.currentTarget);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!content) return children;

    // Attach listeners directly to the child element to avoid layout wrapper pollution
    const trigger = React.cloneElement(children, {
        "aria-describedby": content ? id : undefined,
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            showTooltip(e);
            children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            hideTooltip();
            children.props.onMouseLeave?.(e);
        },
        onFocus: (e: React.FocusEvent<HTMLElement>) => {
            showTooltip(e);
            children.props.onFocus?.(e);
        },
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
            hideTooltip();
            children.props.onBlur?.(e);
        },
    });

    const style: React.CSSProperties = {
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: `${coords.translate} scale(${isVisible ? 1 : 0.95})`,
        transition: "opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isVisible ? 1 : 0,
    };

    return (
        <>
            {trigger}
            {mounted &&
                createPortal(
                    <div
                        id={id}
                        role="tooltip"
                        aria-hidden={!isVisible}
                        style={style}
                        className={`absolute z-50 px-2.5 py-1.5 text-xs font-semibold rounded-lg shadow-lg pointer-events-none whitespace-nowrap
                            bg-neutral-900/95 text-neutral-100 dark:bg-white/95 dark:text-neutral-900 backdrop-blur-md
                            ring-1 ring-white/15 dark:ring-neutral-900/10
                            ${originClasses[placement]}
                            ${className}`}
                    >
                        <div className="relative z-10">{content}</div>
                        <div
                            className={`absolute w-1.5 h-1.5 rotate-45 bg-neutral-900 dark:bg-white
                                border-neutral-800 dark:border-neutral-200
                                ${arrowClasses[placement]}`}
                            aria-hidden="true"
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}
