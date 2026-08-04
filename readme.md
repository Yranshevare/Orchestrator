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
1. **make sure you have bun installed**

```bash
bun --version
```
if it is not installed then run following command to install it:
```bash
powershell -c "irm bun.sh/install.ps1 | iex"    # for windows
# OR
curl -fsSL https://bun.sh/install | bash    # for mac or linux
```
> the library `OpenTUI` need some extra configuration in `Node.js`, more precisely `Node.js 26.4+` with `--experimental-ffi` enabled. That's why we are using `bun` as `bun` has its own built-in FFI (`bun:ffi`) 

> The key point is that `OpenTUI` is not a pure JavaScript library. The renderer is written in `Zig` and accessed through FFI (Foreign Function Interface).

2. **clone the repo**
```bash
git clone https://github.com/Yranshevare/Orchestrator.git

cd Orchestrator
```
3. **install the dependencies**
```bash
bun install
```
4. **execute the program**
```bash
bun run dev
```
> this will open up the Terminal UI of our agent

### This project also contains an env file, that defines your running environment

You can skip adding `.env` file to access the production environments

To access the development environment
1. add `.env` file at the root of the project
2. add following line into that `.env` file
```js 
RUNTIME="dev"
```
This gives you access to a developer features like in terminal console for print statements, some under development commands, etc


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
| Enter | to submit  |