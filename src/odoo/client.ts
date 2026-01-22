import xmlrpc from 'xmlrpc';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import { getConfig } from '../config/index.js';
import { logger } from '../logger/index.js';

const config = getConfig();

export interface OdooCredentials {
  url: string;
  database: string;
  username: string;
  password: string;
  apiKey?: string;
}

export interface OdooSearchOptions {
  domain?: Array<[string, string, unknown]>;
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}

export interface OdooRecord {
  id: number;
  [key: string]: unknown;
}

export class OdooClient {
  private credentials: OdooCredentials;
  private uid: number | null = null;
  private xmlrpcClient: xmlrpc.Client;
  private jsonrpcClient: AxiosInstance;
  private useJsonRpc: boolean = false;
  private accessToken: string | null = null;

  constructor(credentials?: Partial<OdooCredentials>) {
    this.credentials = {
      url: credentials?.url || config.odooUrl,
      database: credentials?.database || config.odooDatabase,
      username: credentials?.username || config.odooUsername,
      password: credentials?.password || config.odooPassword,
      apiKey: credentials?.apiKey || config.odooApiKey,
    };

    // Initialize XML-RPC client (for Odoo < 19)
    const url = new URL(this.credentials.url);
    const isSecure = url.protocol === 'https:';
    this.xmlrpcClient = xmlrpc.createClient({
      host: url.hostname,
      port: parseInt(url.port) || (isSecure ? 443 : 80),
      path: '/xmlrpc/2/common',
      basic_auth: url.username && url.password
        ? { user: url.username, pass: url.password }
        : undefined,
    });

    // Initialize JSON-RPC client (for Odoo 19+)
    this.jsonrpcClient = axios.create({
      baseURL: this.credentials.url,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Detect Odoo version and preferred protocol
   */
  private async detectOdooVersion(): Promise<void> {
    try {
      // Try Odoo 19+ JSON-RPC authentication first
      const password = this.credentials.apiKey || this.credentials.password;
      const authResponse = await this.jsonrpcClient.post('/json/2/auth', {
        db: this.credentials.database,
        login: this.credentials.username,
        password: password,
      });

      if (authResponse.data && authResponse.data.access_token) {
        this.useJsonRpc = true;
        this.accessToken = authResponse.data.access_token;
        this.uid = authResponse.data.uid || null;
        logger.info('Odoo 19+ detected, using JSON-RPC API');
        return;
      }
    } catch (error) {
      // If JSON-RPC fails, fall back to XML-RPC
      logger.debug('JSON-RPC not available, falling back to XML-RPC');
    }

    // Fall back to XML-RPC for older versions
    this.useJsonRpc = false;
  }

  /**
   * Authenticate with Odoo and get user ID
   */
  async authenticate(): Promise<number> {
    // Detect Odoo version on first authentication
    if (this.uid === null && !this.useJsonRpc && !this.accessToken) {
      await this.detectOdooVersion();
    }

    if (this.useJsonRpc && this.accessToken) {
      // Already authenticated via JSON-RPC
      if (this.uid) {
        return this.uid;
      }
      throw new Error('Authentication failed: No UID returned');
    }

    // XML-RPC authentication
    return new Promise((resolve, reject) => {
      const password = this.credentials.apiKey || this.credentials.password;
      this.xmlrpcClient.methodCall('authenticate', [
        this.credentials.database,
        this.credentials.username,
        password,
        {},
      ], (error: Error | null, uid: number) => {
        if (error) {
          logger.error('Odoo authentication failed', { error: error.message });
          reject(error);
          return;
        }
        if (!uid) {
          logger.error('Odoo authentication failed: Invalid credentials');
          reject(new Error('Invalid credentials'));
          return;
        }
        this.uid = uid;
        logger.info(`Odoo authentication successful: UID ${uid}`);
        resolve(uid);
      });
    });
  }

  /**
   * Execute a method on an Odoo model
   */
  async execute(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
  ): Promise<unknown> {
    if (!this.uid && !this.accessToken) {
      await this.authenticate();
    }

    // Use JSON-RPC for Odoo 19+
    if (this.useJsonRpc && this.accessToken) {
      try {
        // Odoo 19+ uses /json/2/<model>/<method> endpoint
        const endpoint = `/json/2/${model}/${method}`;
        const response = await this.jsonrpcClient.post(
          endpoint,
          {
            args: args,
            kwargs: kwargs,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (response.data && response.data.error) {
          throw new Error(response.data.error.message || 'Odoo API error');
        }

        return response.data.result;
      } catch (error) {
        logger.error(`Odoo JSON-RPC execute failed: ${model}.${method}`, { error });
        // Fall back to XML-RPC if JSON-RPC fails
        if (isAxiosError(error) && error.response?.status === 404) {
          logger.warn('JSON-RPC endpoint not found, falling back to XML-RPC');
          this.useJsonRpc = false;
          // Continue to XML-RPC fallback
        } else {
          throw error;
        }
      }
    }

    // XML-RPC fallback (for Odoo < 19 or if JSON-RPC fails)
    return new Promise((resolve, reject) => {
      const url = new URL(this.credentials.url);
      const isSecure = url.protocol === 'https:';
      const objectClient = xmlrpc.createClient({
        host: url.hostname,
        port: parseInt(url.port) || (isSecure ? 443 : 80),
        path: '/xmlrpc/2/object',
        basic_auth: url.username && url.password
          ? { user: url.username, pass: url.password }
          : undefined,
      });

      objectClient.methodCall(
        'execute_kw',
        [
          this.credentials.database,
          this.uid,
          this.credentials.apiKey || this.credentials.password,
          model,
          method,
          args,
          kwargs,
        ],
        (error: Error | null, result: unknown) => {
          if (error) {
            logger.error(`Odoo XML-RPC execute failed: ${model}.${method}`, { error: error.message });
            reject(error);
            return;
          }
          resolve(result);
        }
      );
    });
  }

  /**
   * Search records
   */
  async search(model: string, options: OdooSearchOptions = {}): Promise<number[]> {
    const domain = options.domain || [];
    const kwargs: Record<string, unknown> = {};

    if (options.limit) kwargs.limit = options.limit;
    if (options.offset) kwargs.offset = options.offset;
    if (options.order) kwargs.order = options.order;

    return (await this.execute(model, 'search', [domain], kwargs)) as number[];
  }

  /**
   * Read records
   */
  async read(model: string, ids: number[], fields?: string[]): Promise<OdooRecord[]> {
    const kwargs: Record<string, unknown> = {};
    if (fields) kwargs.fields = fields;

    return (await this.execute(model, 'read', [ids], kwargs)) as OdooRecord[];
  }

  /**
   * Search and read records in one call
   */
  async searchRead(model: string, options: OdooSearchOptions = {}): Promise<OdooRecord[]> {
    const domain = options.domain || [];
    const kwargs: Record<string, unknown> = {};

    if (options.fields) kwargs.fields = options.fields;
    if (options.limit) kwargs.limit = options.limit;
    if (options.offset) kwargs.offset = options.offset;
    if (options.order) kwargs.order = options.order;

    return (await this.execute(model, 'search_read', [domain], kwargs)) as OdooRecord[];
  }

  /**
   * Create a record
   */
  async create(model: string, values: Record<string, unknown>): Promise<number> {
    return (await this.execute(model, 'create', [values])) as number;
  }

  /**
   * Update records
   */
  async write(model: string, ids: number[], values: Record<string, unknown>): Promise<boolean> {
    return (await this.execute(model, 'write', [ids, values])) as boolean;
  }

  /**
   * Delete records
   */
  async delete(model: string, ids: number[]): Promise<boolean> {
    return (await this.execute(model, 'unlink', [ids])) as boolean;
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<Array<{ model: string; name: string }>> {
    try {
      // Try to get models from ir.model
      const models = await this.searchRead('ir.model', {
        domain: [['transient', '=', false]],
        fields: ['model', 'name'],
        order: 'name',
      });

      return models.map((m) => ({
        model: m.model as string,
        name: m.name as string,
      }));
    } catch (error) {
      logger.error('Failed to fetch available models', { error });
      // Return common Odoo models as fallback
      return [
        { model: 'res.partner', name: 'Partner' },
        { model: 'res.users', name: 'User' },
        { model: 'sale.order', name: 'Sale Order' },
        { model: 'purchase.order', name: 'Purchase Order' },
        { model: 'account.move', name: 'Invoice' },
        { model: 'stock.picking', name: 'Stock Picking' },
        { model: 'project.project', name: 'Project' },
        { model: 'crm.lead', name: 'Lead' },
      ];
    }
  }

  /**
   * Get model fields
   */
  async getModelFields(model: string): Promise<Record<string, unknown>> {
    return (await this.execute(model, 'fields_get', [], {})) as Record<string, unknown>;
  }
}

// Export singleton instance
let odooClient: OdooClient | null = null;

export function getOdooClient(credentials?: Partial<OdooCredentials>): OdooClient {
  if (!odooClient) {
    odooClient = new OdooClient(credentials);
  }
  return odooClient;
}
