// CapRover API integration service

export interface CapRoverConfig {
  serverUrl: string;
  password: string;
  namespace?: string;
}

export interface AppDeployment {
  appName: string;
  captainDefinitionContent: string;
  gitHash?: string;
  tarFile?: Buffer;
}

export interface DeploymentResult {
  success: boolean;
  buildLogs?: string;
  deployUrl?: string;
  error?: string;
}

export class CapRoverService {
  private config: CapRoverConfig;
  private authToken?: string;

  constructor(config: CapRoverConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: this.config.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.data.token;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('CapRover authentication failed:', error);
      return false;
    }
  }

  async createApp(appName: string, hasPersistentData: boolean = false): Promise<boolean> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-captain-auth': this.authToken
        },
        body: JSON.stringify({
          appName,
          hasPersistentData
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to create app:', error);
      return false;
    }
  }

  async deployApp(deployment: AppDeployment): Promise<DeploymentResult> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      // First ensure app exists
      await this.createApp(deployment.appName);

      // Deploy using captain definition
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appData/${deployment.appName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-captain-auth': this.authToken
        },
        body: JSON.stringify({
          captainDefinitionContent: deployment.captainDefinitionContent,
          gitHash: deployment.gitHash || Date.now().toString(),
          tarFile: deployment.tarFile ? deployment.tarFile.toString('base64') : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Get build logs
        const buildLogs = await this.getBuildLogs(deployment.appName);
        
        return {
          success: true,
          buildLogs,
          deployUrl: `https://${deployment.appName}.${this.extractDomain()}`
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBuildLogs(appName: string): Promise<string> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appData/${appName}/logs`, {
        method: 'GET',
        headers: {
          'x-captain-auth': this.authToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.logs || '';
      }
      
      return '';
    } catch (error) {
      console.error('Failed to get build logs:', error);
      return '';
    }
  }

  async getAppInfo(appName: string): Promise<any> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions/${appName}`, {
        method: 'GET',
        headers: {
          'x-captain-auth': this.authToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get app info:', error);
      return null;
    }
  }

  async deleteApp(appName: string): Promise<boolean> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions/${appName}`, {
        method: 'DELETE',
        headers: {
          'x-captain-auth': this.authToken
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete app:', error);
      return false;
    }
  }

  async listApps(): Promise<any[]> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions`, {
        method: 'GET',
        headers: {
          'x-captain-auth': this.authToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.appDefinitions || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to list apps:', error);
      return [];
    }
  }

  async setEnvironmentVariables(appName: string, envVars: Record<string, string>): Promise<boolean> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-captain-auth': this.authToken
        },
        body: JSON.stringify({
          appName,
          envVars: Object.entries(envVars).map(([key, value]) => ({
            key,
            value
          }))
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to set environment variables:', error);
      return false;
    }
  }

  async enableSsl(appName: string, domain?: string): Promise<boolean> {
    if (!this.authToken) {
      throw new Error('Not authenticated with CapRover');
    }

    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/user/apps/appDefinitions/enablessl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-captain-auth': this.authToken
        },
        body: JSON.stringify({
          appName,
          customDomain: domain
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to enable SSL:', error);
      return false;
    }
  }

  async getDeploymentStatus(appName: string): Promise<string> {
    const appInfo = await this.getAppInfo(appName);
    
    if (!appInfo) {
      return 'unknown';
    }

    // CapRover app status mapping
    if (appInfo.isAppBuilding) {
      return 'building';
    }
    
    if (appInfo.appPushWebhook && appInfo.appPushWebhook.isEnabled) {
      return 'deployed';
    }
    
    return 'stopped';
  }

  private extractDomain(): string {
    // Extract domain from server URL (e.g., https://captain.example.com -> example.com)
    try {
      const url = new URL(this.config.serverUrl);
      return url.hostname.replace('captain.', '');
    } catch {
      return 'localhost';
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/v2/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'test'
        })
      });

      // Even if login fails, a 401 response means the server is reachable
      return response.status === 401 || response.ok;
    } catch {
      return false;
    }
  }
}

// Factory function to create CapRover service from settings
export async function createCapRoverService(): Promise<CapRoverService | null> {
  try {
    // This would typically fetch from admin settings
    const serverUrl = process.env.CAPROVER_SERVER_URL;
    const password = process.env.CAPROVER_PASSWORD;

    if (!serverUrl || !password) {
      return null;
    }

    const service = new CapRoverService({
      serverUrl,
      password
    });

    const authenticated = await service.authenticate();
    
    if (!authenticated) {
      return null;
    }

    return service;
  } catch (error) {
    console.error('Failed to create CapRover service:', error);
    return null;
  }
}