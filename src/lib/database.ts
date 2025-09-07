import Database from 'better-sqlite3';
import { join } from 'path';

// Database interface for abstraction
export interface DatabaseAdapter {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  run(sql: string, params?: any[]): Promise<{ lastInsertRowid?: number; changes?: number }>;
  close(): Promise<void>;
}

// SQLite implementation
class SQLiteAdapter implements DatabaseAdapter {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        github_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        repository_url TEXT,
        branch TEXT DEFAULT 'main',
        build_command TEXT DEFAULT 'npm run build',
        install_command TEXT DEFAULT 'npm install',
        output_directory TEXT DEFAULT 'dist',
        framework TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Environment Variables table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS env_variables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        is_secret BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        UNIQUE(project_id, key)
      )
    `);

    // Deployments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS deployments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'success', 'failed')),
        build_logs TEXT,
        deploy_url TEXT,
        commit_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    // Admin Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user if not exists
    const adminExists = this.db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    if (!adminExists) {
      this.db.prepare(`
        INSERT INTO users (email, name, password, role)
        VALUES (?, ?, ?, ?)
      `).run('admin@deployhub.com', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMaQJqO8k2fhNZmfEQwW8h9A9u', 'admin'); // password: admin123
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.all(...params);
      return result as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async run(sql: string, params: any[] = []): Promise<{ lastInsertRowid?: number; changes?: number }> {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      return {
        lastInsertRowid: result.lastInsertRowid as number,
        changes: result.changes
      };
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

// MySQL implementation placeholder
class MySQLAdapter implements DatabaseAdapter {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    throw new Error('MySQL adapter not implemented yet');
  }

  async run(sql: string, params?: any[]): Promise<{ lastInsertRowid?: number; changes?: number }> {
    throw new Error('MySQL adapter not implemented yet');
  }

  async close(): Promise<void> {
    throw new Error('MySQL adapter not implemented yet');
  }
}

// Database factory
let dbInstance: DatabaseAdapter | null = null;

export function getDatabase(): DatabaseAdapter {
  if (!dbInstance) {
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    if (dbType === 'mysql') {
      dbInstance = new MySQLAdapter();
    } else {
      const dbPath = process.env.SQLITE_PATH || join(process.cwd(), 'database.sqlite');
      dbInstance = new SQLiteAdapter(dbPath);
    }
  }
  
  return dbInstance;
}

// Helper functions for common queries
export class DatabaseService {
  private db: DatabaseAdapter;

  constructor() {
    this.db = getDatabase();
  }

  // User operations
  async createUser(email: string, name: string, password: string, role: string = 'user') {
    const result = await this.db.run(
      'INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)',
      [email, name, password, role]
    );
    return result.lastInsertRowid;
  }

  async getUserByEmail(email: string) {
    const users = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0] || null;
  }

  async getUserById(id: number) {
    const users = await this.db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  // Project operations
  async createProject(userId: number, projectData: any) {
    const result = await this.db.run(
      'INSERT INTO projects (user_id, name, repository_url, branch, build_command, install_command, output_directory, framework) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, projectData.name, projectData.repository_url, projectData.branch, projectData.build_command, projectData.install_command, projectData.output_directory, projectData.framework]
    );
    return result.lastInsertRowid;
  }

  async getProjectsByUserId(userId: number) {
    return await this.db.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async getProjectById(id: number) {
    const projects = await this.db.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    return projects[0] || null;
  }

  // Environment variables
  async setEnvVariable(projectId: number, key: string, value: string, isSecret: boolean = false) {
    await this.db.run(
      'INSERT OR REPLACE INTO env_variables (project_id, key, value, is_secret) VALUES (?, ?, ?, ?)',
      [projectId, key, value, isSecret]
    );
  }

  async getEnvVariables(projectId: number) {
    return await this.db.query(
      'SELECT * FROM env_variables WHERE project_id = ? ORDER BY key',
      [projectId]
    );
  }

  // Deployments
  async createDeployment(projectId: number, commitHash?: string) {
    const result = await this.db.run(
      'INSERT INTO deployments (project_id, commit_hash, status) VALUES (?, ?, ?)',
      [projectId, commitHash, 'pending']
    );
    return result.lastInsertRowid;
  }

  async updateDeploymentStatus(id: number, status: string, buildLogs?: string, deployUrl?: string) {
    await this.db.run(
      'UPDATE deployments SET status = ?, build_logs = ?, deploy_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, buildLogs, deployUrl, id]
    );
  }

  async getDeploymentsByProjectId(projectId: number) {
    return await this.db.query(
      'SELECT * FROM deployments WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
  }

  // Admin settings
  async setSetting(key: string, value: string, description?: string) {
    await this.db.run(
      'INSERT OR REPLACE INTO admin_settings (key, value, description) VALUES (?, ?, ?)',
      [key, value, description]
    );
  }

  async getSetting(key: string) {
    const settings = await this.db.query(
      'SELECT value FROM admin_settings WHERE key = ?',
      [key]
    );
    return settings[0]?.value || null;
  }

  async getAllSettings() {
    return await this.db.query('SELECT * FROM admin_settings ORDER BY key');
  }
}