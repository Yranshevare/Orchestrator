/** @jsxImportSource @opentui/react */

import { useEffect, useState } from "react";
import { theme } from "../theme";

const DEFAULT_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const DOT_FRAMES = [".", "..", "...", " ..", "  .", "   "];

type AnimatedIconProps = {
    frames?: string[];
    interval?: number;
    message: string;
};

export function AnimatedIcon({ frames = DEFAULT_FRAMES, interval = 80, message }: AnimatedIconProps) {
    const [frame, setFrame] = useState(0);
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrame((f) => (f + 1) % frames.length);
            setDots((d) => (d + 1) % DOT_FRAMES.length);
        }, interval);

        return () => clearInterval(id);
    }, [frames, interval]);

    return (
        <box flexDirection="row" gap={1}>
            <text fg={theme.muted}>{frames[frame]}</text>
            <text fg={theme.muted}>{message}{DOT_FRAMES[dots]}</text>
        </box>
    );
}
