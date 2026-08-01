import { useRef } from "react";
import { theme } from "../theme";

export default function ModelConfigForm() {
    const ref = useRef(null);
    return (
        <box ref={ref} position="absolute" width="100%" backgroundColor={theme.muted}>
            <textarea placeholder={"search model"}></textarea>
        </box>
    );
}
