"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CoffeeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CoffeeIconProps extends HTMLAttributes<SVGElement> {
  size?: number;
}

const pathVariants: Variants = {
  normal: {
    y: 0,
    opacity: 1,
  },
  animate: (custom: number) => ({
    y: -3,
    opacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
      delay: 0.2 * custom,
    },
  }),
};

const CoffeeIcon = forwardRef<CoffeeIconHandle, CoffeeIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<SVGElement>) => {
        if (!isControlledRef.current) {
          controls.start("animate");
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<SVGElement>) => {
        if (!isControlledRef.current) {
          controls.start("normal");
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: "visible" }}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.path
          d="M10 2v2"
          animate={controls}
          variants={pathVariants}
          custom={0.2}
        />
        <motion.path
          d="M14 2v2"
          animate={controls}
          variants={pathVariants}
          custom={0.4}
        />
        <motion.path
          d="M6 2v2"
          animate={controls}
          variants={pathVariants}
          custom={0}
        />
        <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      </svg>
    );
  },
);

CoffeeIcon.displayName = "CoffeeIcon";

export { CoffeeIcon };
