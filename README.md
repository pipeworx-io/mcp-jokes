# mcp-jokes

MCP server for jokes. Get random jokes, search by keyword, browse categories, and filter with safe mode via JokeAPI — free, no API key required.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_joke` | Get a random joke by category (Programming, Pun, Dark, etc.) |
| `search_jokes` | Search jokes by keyword |
| `get_joke_categories` | List all available joke categories |
| `get_joke_flags` | List available content flags/filters |

## Quick Start

```json
{
  "mcpServers": {
    "jokes": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://gateway.pipeworx.io/jokes/mcp"]
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use jokes
```

## License

MIT
