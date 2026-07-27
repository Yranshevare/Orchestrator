import React from "react";
import { Box, Text } from "ink";

const items = [
    "New Task",
    "History",
    "Models",
    "Settings"
];

export default function Sidebar() {
    return (
        <Box
            width={24}
            borderStyle="round"
            flexDirection="column"
            padding={1}
        >
            {items.map((item, index) => (
                <Text key={item}>
                    {index === 0 ? "❯ " : "  "}
                    {item}
                </Text>
            ))}
        </Box>
    );
}