interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Jokes MCP — wraps JokeAPI v2 (free, no auth)
 *
 * Tools:
 * - get_joke: Get a random joke by category and type
 * - search_jokes: Search jokes by keyword
 * - get_joke_categories: List available joke categories
 * - get_joke_flags: List available joke flags/filters
 */


const BASE_URL = 'https://v2.jokeapi.dev';

type JokeType = 'single' | 'twopart';

type RawJoke = {
  type: JokeType;
  category: string;
  flags: Record<string, boolean>;
  id: number;
  safe: boolean;
  lang: string;
  // single
  joke?: string;
  // twopart
  setup?: string;
  delivery?: string;
};

type RawJokeResponse = RawJoke & {
  error: boolean;
  message?: string;
};

type RawSearchResponse = {
  error: boolean;
  message?: string;
  totalCount?: number;
  jokes?: RawJoke[];
};

type RawCategoriesResponse = {
  error: boolean;
  message?: string;
  categories?: string[];
};

type RawFlagsResponse = {
  error: boolean;
  message?: string;
  flags?: string[];
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_joke',
    description:
      'Get a random joke. Optionally filter by category, type (single-line or two-part), and safe mode.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'Joke category. One of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas. Defaults to "Any".',
        },
        type: {
          type: 'string',
          description:
            'Joke type. One of: single, twopart. Omit to allow either type.',
        },
        safe_mode: {
          type: 'boolean',
          description:
            'When true, only return jokes that are flagged safe by JokeAPI. Defaults to true.',
        },
      },
    },
  },
  {
    name: 'search_jokes',
    description: 'Search for jokes containing a specific keyword or phrase.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword or phrase to search for within joke text.',
        },
        category: {
          type: 'string',
          description:
            'Limit search to a category. One of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas. Defaults to "Any".',
        },
        amount: {
          type: 'number',
          description: 'Number of jokes to return. Defaults to 5.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_joke_categories',
    description: 'List all available joke categories supported by JokeAPI.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_joke_flags',
    description:
      'List all available joke flags (content filters) supported by JokeAPI.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_joke':
      return getJoke(
        (args.category as string | undefined) ?? 'Any',
        args.type as string | undefined,
        (args.safe_mode as boolean | undefined) ?? true,
      );
    case 'search_jokes':
      return searchJokes(
        args.query as string,
        (args.category as string | undefined) ?? 'Any',
        (args.amount as number | undefined) ?? 5,
      );
    case 'get_joke_categories':
      return getJokeCategories();
    case 'get_joke_flags':
      return getJokeFlags();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function formatJoke(joke: RawJoke) {
  const base = {
    type: joke.type,
    category: joke.category,
    safe: joke.safe,
  };
  if (joke.type === 'single') {
    return { ...base, joke: joke.joke! };
  }
  return { ...base, setup: joke.setup!, delivery: joke.delivery! };
}

async function getJoke(category: string, type: string | undefined, safeMode: boolean) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (safeMode) params.set('safe-mode', '');

  const query = params.toString();
  const url = `${BASE_URL}/joke/${encodeURIComponent(category)}${query ? `?${query}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`JokeAPI error: ${res.status}`);

  const data = (await res.json()) as RawJokeResponse;
  if (data.error) throw new Error(`JokeAPI error: ${data.message ?? 'unknown error'}`);

  return formatJoke(data);
}

async function searchJokes(query: string, category: string, amount: number) {
  const url = `${BASE_URL}/joke/${encodeURIComponent(category)}?contains=${encodeURIComponent(query)}&amount=${amount}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`JokeAPI error: ${res.status}`);

  const data = (await res.json()) as RawSearchResponse;
  if (data.error) throw new Error(`JokeAPI error: ${data.message ?? 'unknown error'}`);

  // When amount=1, JokeAPI returns a single joke object (no jokes array)
  const jokes = data.jokes ?? [];

  return {
    total: data.totalCount ?? jokes.length,
    query,
    category,
    jokes: jokes.map(formatJoke),
  };
}

async function getJokeCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error(`JokeAPI error: ${res.status}`);

  const data = (await res.json()) as RawCategoriesResponse;
  if (data.error) throw new Error(`JokeAPI error: ${data.message ?? 'unknown error'}`);

  return { categories: data.categories ?? [] };
}

async function getJokeFlags() {
  const res = await fetch(`${BASE_URL}/flags`);
  if (!res.ok) throw new Error(`JokeAPI error: ${res.status}`);

  const data = (await res.json()) as RawFlagsResponse;
  if (data.error) throw new Error(`JokeAPI error: ${data.message ?? 'unknown error'}`);

  return { flags: data.flags ?? [] };
}

export default { tools, callTool } satisfies McpToolExport;
