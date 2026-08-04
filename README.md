# mcp-jokes

Jokes MCP — wraps JokeAPI v2 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_joke` | Get a random joke, optionally filtered by category (e.g., 'general', 'programming') or type ('single' or 'twopart'). Returns joke text, category, and content flags. |
| `search_jokes` | Search jokes by keyword or phrase. Returns matching jokes with categories, types, and content flags. |
| `get_joke_categories` | List all available JokeAPI joke categories (e.g., Programming, Misc, Dark, Pun, Spooky, Christmas). Use the returned category names as the category input to get_joke or search_jokes. |
| `get_joke_flags` | List all content filter flags (e.g., explicit, political, racist). Use to understand what filters exclude. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "jokes": {
      "url": "https://gateway.pipeworx.io/jokes/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Jokes data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
