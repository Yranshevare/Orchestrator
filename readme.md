# Orchestrator

**Orchestrator** is a vendor-agnostic AI orchestration platform designed to coordinate multiple AI coding agents through a single, unified workflow.

Instead of developers manually interacting with different AI coding assistants, Orchestrator acts as a central intelligence layer that understands the user's objective, maintains a shared project context, and delegates tasks to the most suitable connected AI agents.

The platform is responsible for:
- Maintaining a centralized project context and memory.
- Breaking complex software development requests into manageable tasks.
- Distributing task-specific context to connected AI coding agents.
- Scheduling independent tasks for parallel execution whenever possible.
- Collecting and consolidating outputs into a unified project state.
- Keeping all connected agents synchronized without requiring users to repeatedly provide context.

Orchestrator does **not** replace existing AI coding assistants such as Claude Code, Codex, or Gemini CLI. Instead, it enables them to collaborate within a single, context-aware development workflow.

## Vision

To provide a unified orchestration layer for AI-assisted software development, allowing developers to seamlessly integrate multiple coding agents while eliminating manual context management and workflow coordination.

> **One Context. Multiple AI Coding Agents.**

---

# Project Setup
### Step 1: Make sure you have bun installed

```bash
bun --version
```
If bun is not installed then run following command to install it:
```bash
powershell -c "irm bun.sh/install.ps1 | iex"    # for windows
# OR
curl -fsSL https://bun.sh/install | bash    # for mac or linux
```
> Why Bun?
>
> `OpenTUI` is not a pure JavaScript library. It's renderer is written in `Zig` (a general-purpose programming language) and accessed through FFI (Foreign Function Interface).
>
> While `Node.js` can run `OpenTUI` only with **`Node.js 26.4+`** and `--experimental-ffi`, `Bun` provides built-in FFI support out of the box, making setup much simpler.

### Step 2: Clone the Repository
```bash
git clone https://github.com/Yranshevare/Orchestrator.git

cd Orchestrator
```
### Step 3: Install Dependencies
```bash
bun install
```
### Step 4: Run the Project
```bash
bun run dev
```
> This launches the Orchestrator Terminal UI.

### Development Environment

The project works without a `.env` file and connects to the **production** environment by default.

To use the **development environment**:
1. Create a `.env` file at the root of the project
2. Add following line into that `.env` file
```js 
RUNTIME="dev"
```
This gives you access to:
| Feature | Description |
|---------|-------------|
| Terminal Console (Ctrl + t) | Enables console output for debugging (`console.log`, etc.). |
| Experimental Commands | Access to commands currently under development. |


---

# Available commands
Type `/` in input box to access the list available commands

| No. | Command                                                | Description                               | Example                                                               |
| :-: | ------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------- |
|  1  | `/exit`                                                | Exit the Terminal UI.                     | `/exit`                                                               |
|  2  | `/agent`                                               | List all registered agents.               | `/agent`                                                              |
|  3  | `/agent <name>`                                        | Show details of a specific agent.         | `/agent claude`                                                       |
|  4  | `/agent-add <name> "<launch-command>" "<when-to-use>"` | Register a new AI agent.                  | `/agent-add claude "ollama launch claude" "use for complex problems"` |
|  5  | `/agent-update <name> --key value`                     | Update an existing agent's configuration. | `/agent-update claude --name claude_with_ollama`                      |
|  6  | `/agent-delete <name>`                                 | Delete a registered agent.                | `/agent-delete claude`                                                |

---

# Keyboard Events
| keys | use for|
| --- | --- |
| up / down arrow | switch between the agents |
| Shift + Tab | to change the agents mode |  
| Ctrl + t | to access the in terminal console (only for development environment) |
| Enter | submit  |
| Tab | accept | 