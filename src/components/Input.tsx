import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";

export default function Input() {
    return (
        <box
            flexDirection="row"
            paddingX={1}
            paddingTop={1}
            justifyContent="space-between"
            backgroundColor={theme.inputBackground}
            width="100%"
            
        >
            <box flexDirection="row" gap={1}>
                <text fg={theme.primary}>|</text>
                <textarea placeholder="Ask or command anything..." height={2} width={"auto"} focused justifyContent="center" />
            </box>
            <text fg={theme.primary} attributes={TextAttributes.BOLD} marginRight={2}>⏎ </text>
        </box>
    );
}
