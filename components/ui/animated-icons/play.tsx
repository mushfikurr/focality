"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import type { SVGMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PlayIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PlayIconProps extends SVGMotionProps<SVGSVGElement> {
  size?: number;
}

const pathVariants: Variants = {
  normal: {
    x: 0,
    rotate: 0,
  },
  animate: {
    x: [0, -1, 2, 0],
    rotate: [0, -10, 0, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.5, 1],
      stiffness: 260,
      damping: 20,
    },
  },
};

const PlayIcon = forwardRef<PlayIconHandle, PlayIconProps>(
  ({ className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    const userOnMouseEnter = props.onMouseEnter as
      | React.MouseEventHandler<SVGSVGElement>
      | undefined;
    const userOnMouseLeave = props.onMouseLeave as
      | React.MouseEventHandler<SVGSVGElement>
      | undefined;

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isControlledRef.current) {
          controls.start("animate");
        } else {
          userOnMouseEnter?.(e);
        }
      },
      [controls, userOnMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isControlledRef.current) {
          controls.start("normal");
        } else {
          userOnMouseLeave?.(e);
        }
      },
      [controls, userOnMouseLeave],
    );

    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("cursor-pointer", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={controls}
        {...props}
      >
        <motion.polygon points="6 3 20 12 6 21 6 3" variants={pathVariants} />
      </motion.svg>
    );
  },
);

PlayIcon.displayName = "PlayIcon";

export { PlayIcon };
