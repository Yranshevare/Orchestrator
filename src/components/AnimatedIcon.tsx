/** @jsxImportSource @opentui/react */

import { useEffect, useState } from "react";

const DEFAULT_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

type AnimatedIconProps = {
    frames?: string[];
    interval?: number;
    color?: string;
};

export function AnimatedIcon({ frames = DEFAULT_FRAMES, interval = 80, color = "cyan" }: AnimatedIconProps) {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrame((f) => (f + 1) % frames.length);
        }, interval);

        return () => clearInterval(id);
    }, [frames, interval]);

    return <text fg={color}>{frames[frame]}</text>;
}
