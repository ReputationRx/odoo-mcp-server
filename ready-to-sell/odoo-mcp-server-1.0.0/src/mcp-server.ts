import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getOdooClient } from './odoo/client.js';
import { logger } from './logger/index.js';
import { getConfig } from './config/index.js';

const config = getConfig();

// Tool schemas
const searchRecordsSchema = z.object({
  model: z.string().describe('Odoo model name (e.g., res.partner, sale.order)'),
  domain: z.array(z.array(z.unknown())).optional().describe('Search domain (e.g., [["name", "ilike", "test"]])'),
  fields: z.array(z.string()).optional().describe('Fields to retrieve'),
  limit: z.number().int().positive().max(1000).optional().describe('Maximum number of records to return'),
  offset: z.number().int().nonnegative().optional().describe('Offset for pagination'),
  order: z.string().optional().describe('Order by field (e.g., "name asc")'),
});

const createRecordSchema = z.object({
  model: z.string().describe('Odoo model name'),
  values: z.record(z.unknown()).describe('Field values for the new record'),
});

const updateRecordSchema = z.object({
  model: z.string().describe('Odoo model name'),
  ids: z.array(z.number()).describe('IDs of records to update'),
  values: z.record(z.unknown()).describe('Field values to update'),
});

const deleteRecordSchema = z.object({
  model: z.string().describe('Odoo model name'),
  ids: z.array(z.number()).describe('IDs of records to delete'),
});

const getModelFieldsSchema = z.object({
  model: z.string().describe('Odoo model name'),
});

/**
 * Create and configure the MCP server
 */
export async function createMcpServer(): Promise<Server> {
  const server = new Server(
    {
      name: 'odoo-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'odoo_search_records',
          description: 'Search and retrieve records from an Odoo model',
          inputSchema: {
            type: 'object',
            properties: {
              model: {
                type: 'string',
                description: 'Odoo model name (e.g., res.partner, sale.order)',
              },
              domain: {
                type: 'array',
                description: 'Search domain (e.g., [["name", "ilike", "test"]])',
                items: {
                  type: 'array',
                  items: {},
                },
              },
              fields: {
                type: 'array',
                description: 'Fields to retrieve',
                items: { type: 'string' },
              },
              limit: {
                type: 'number',
                description: 'Maximum number of records to return',
                minimum: 1,
                maximum: 1000,
              },
              offset: {
                type: 'number',
                description: 'Offset for pagination',
                minimum: 0,
              },
              order: {
                type: 'string',
                description: 'Order by field (e.g., "name asc")',
              },
            },
            required: ['model'],
          },
        },
        {
          name: 'odoo_create_record',
          description: 'Create a new record in an Odoo model',
          inputSchema: {
            type: 'object',
            properties: {
              model: {
                type: 'string',
                description: 'Odoo model name',
              },
              values: {
                type: 'object',
                description: 'Field values for the new record',
              },
            },
            required: ['model', 'values'],
          },
        },
        {
          name: 'odoo_update_record',
          description: 'Update existing records in an Odoo model',
          inputSchema: {
            type: 'object',
            properties: {
              model: {
                type: 'string',
                description: 'Odoo model name',
              },
              ids: {
                type: 'array',
                description: 'IDs of records to update',
                items: { type: 'number' },
              },
              values: {
                type: 'object',
                description: 'Field values to update',
              },
            },
            required: ['model', 'ids', 'values'],
          },
        },
        {
          name: 'odoo_delete_record',
          description: 'Delete records from an Odoo model',
          inputSchema: {
            type: 'object',
            properties: {
              model: {
                type: 'string',
                description: 'Odoo model name',
              },
              ids: {
                type: 'array',
                description: 'IDs of records to delete',
                items: { type: 'number' },
              },
            },
            required: ['model', 'ids'],
          },
        },
        {
          name: 'odoo_get_model_fields',
          description: 'Get field definitions for an Odoo model',
          inputSchema: {
            type: 'object',
            properties: {
              model: {
                type: 'string',
                description: 'Odoo model name',
              },
            },
            required: ['model'],
          },
        },
        {
          name: 'odoo_list_models',
          description: 'List all available Odoo models',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const client = getOdooClient();

      switch (name) {
        case 'odoo_search_records': {
          const params = searchRecordsSchema.parse(args);
          const records = await client.searchRead(params.model, {
            domain: params.domain || [],
            fields: params.fields,
            limit: params.limit,
            offset: params.offset,
            order: params.order,
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(records, null, 2),
              },
            ],
          };
        }

        case 'odoo_create_record': {
          const params = createRecordSchema.parse(args);
          const id = await client.create(params.model, params.values);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ id, success: true }, null, 2),
              },
            ],
          };
        }

        case 'odoo_update_record': {
          const params = updateRecordSchema.parse(args);
          const success = await client.write(params.model, params.ids, params.values);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success }, null, 2),
              },
            ],
          };
        }

        case 'odoo_delete_record': {
          const params = deleteRecordSchema.parse(args);
          const success = await client.delete(params.model, params.ids);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success }, null, 2),
              },
            ],
          };
        }

        case 'odoo_get_model_fields': {
          const params = getModelFieldsSchema.parse(args);
          const fields = await client.getModelFields(params.model);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(fields, null, 2),
              },
            ],
          };
        }

        case 'odoo_list_models': {
          const models = await client.getAvailableModels();

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(models, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error(`Tool execution error: ${name}`, { error, args });
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'odoo://models',
          name: 'Available Odoo Models',
          description: 'List of all available Odoo models',
          mimeType: 'application/json',
        },
      ],
    };
  });

  // Read resources
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
      if (uri === 'odoo://models') {
        const client = getOdooClient();
        const models = await client.getAvailableModels();

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(models, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    } catch (error) {
      logger.error(`Resource read error: ${uri}`, { error });
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });

  return server;
}

/**
 * Start the MCP server with stdio transport
 */
export async function startMcpServer(): Promise<void> {
  if (!config.mcpAccessEnabled) {
    logger.warn('MCP access is disabled. Server will not start.');
    return;
  }

  const server = await createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('MCP server started with stdio transport');
}
