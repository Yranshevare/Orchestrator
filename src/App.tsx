import { Header } from "./components/Header";
import { ChatPanel } from "./components/ChatPanel";
import { StatusBar } from "./components/StatusBar";
import Input from "./components/Input";
import { theme } from "./theme";

export default function App() {
    return (
        <box width="100%" height="100%" flexDirection="column" backgroundColor={theme.background}>
            <Header />

            <box flexGrow={1} flexShrink={1} minHeight={0} overflow="hidden">
                <ChatPanel />
            </box>

            <box flexShrink={0}>
                <Input />
            </box>

            <box flexShrink={0}>
                <StatusBar />
            </box>
        </box>
    );
}
