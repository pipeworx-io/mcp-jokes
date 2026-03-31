# mcp-jokes

Jokes MCP — wraps JokeAPI v2 (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `search_jokes` | Search for jokes containing a specific keyword or phrase. |
| `get_joke_categories` | List all available joke categories supported by JokeAPI. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "jokes": {
      "url": "https://gateway.pipeworx.io/jokes/mcp"
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
