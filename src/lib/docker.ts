// Docker configuration generator for different frameworks

export interface DockerConfig {
  dockerfile: string;
  captainDefinition: string;
  dockerCompose?: string;
}

export interface FrameworkConfig {
  name: string;
  buildCommand: string;
  startCommand: string;
  port: number;
  outputDir: string;
  dependencies: string[];
  devDependencies?: string[];
}

const frameworkConfigs: Record<string, FrameworkConfig> = {
  nextjs: {
    name: 'Next.js',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3000,
    outputDir: '.next',
    dependencies: ['next', 'react', 'react-dom'],
    devDependencies: ['@types/node', '@types/react', '@types/react-dom', 'typescript']
  },
  react: {
    name: 'React',
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s build',
    port: 3000,
    outputDir: 'build',
    dependencies: ['react', 'react-dom', 'serve'],
    devDependencies: ['@types/react', '@types/react-dom']
  },
  vue: {
    name: 'Vue.js',
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s dist',
    port: 3000,
    outputDir: 'dist',
    dependencies: ['vue', 'serve'],
    devDependencies: ['@vue/cli-service']
  },
  angular: {
    name: 'Angular',
    buildCommand: 'ng build --prod',
    startCommand: 'npx serve -s dist',
    port: 3000,
    outputDir: 'dist',
    dependencies: ['@angular/core', '@angular/cli', 'serve'],
    devDependencies: ['@angular/cli']
  },
  static: {
    name: 'Static HTML',
    buildCommand: '',
    startCommand: 'npx serve -s .',
    port: 3000,
    outputDir: '.',
    dependencies: ['serve']
  },
  node: {
    name: 'Node.js',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3000,
    outputDir: 'dist',
    dependencies: ['express']
  }
};

export class DockerGenerator {
  static generateDockerfile(framework: string, customConfig?: Partial<FrameworkConfig>): string {
    const config = { ...frameworkConfigs[framework], ...customConfig };
    
    if (!config) {
      throw new Error(`Framework ${framework} not supported`);
    }

    switch (framework) {
      case 'nextjs':
        return this.generateNextJSDockerfile(config);
      case 'react':
      case 'vue':
      case 'angular':
        return this.generateSPADockerfile(config);
      case 'static':
        return this.generateStaticDockerfile(config);
      case 'node':
        return this.generateNodeDockerfile(config);
      default:
        return this.generateGenericDockerfile(config);
    }
  }

  private static generateNextJSDockerfile(config: FrameworkConfig): string {
    return `
# Use the official Node.js 18 runtime as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate standalone output
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE ${config.port}

ENV PORT ${config.port}

CMD ["node", "server.js"]
`;
  }

  private static generateSPADockerfile(config: FrameworkConfig): string {
    return `
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN ${config.buildCommand}

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/${config.outputDir} ./build

# Expose port
EXPOSE ${config.port}

# Start the application
CMD ["serve", "-s", "build", "-l", "${config.port}"]
`;
  }

  private static generateStaticDockerfile(config: FrameworkConfig): string {
    return `
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy static files
COPY . .

# Expose port
EXPOSE ${config.port}

# Start the application
CMD ["serve", "-s", ".", "-l", "${config.port}"]
`;
  }

  private static generateNodeDockerfile(config: FrameworkConfig): string {
    return `
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if build command exists
${config.buildCommand ? `RUN ${config.buildCommand}` : ''}

# Expose port
EXPOSE ${config.port}

# Start the application
CMD ["${config.startCommand}"]
`;
  }

  private static generateGenericDockerfile(config: FrameworkConfig): string {
    return `
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
${config.buildCommand ? `RUN ${config.buildCommand}` : ''}

# Expose port
EXPOSE ${config.port}

# Start the application
CMD ["${config.startCommand}"]
`;
  }

  static generateCaptainDefinition(framework: string, customConfig?: Partial<FrameworkConfig>): string {
    const config = { ...frameworkConfigs[framework], ...customConfig };
    
    return JSON.stringify({
      schemaVersion: 2,
      dockerfilePath: './Dockerfile',
      imageName: `\${APP_NAME}:\${BUILD_ID}`,
      captainPort: config.port
    }, null, 2);
  }

  static generateDockerCompose(framework: string, projectName: string, customConfig?: Partial<FrameworkConfig>): string {
    const config = { ...frameworkConfigs[framework], ...customConfig };
    
    return `
version: '3.8'

services:
  ${projectName}:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${config.port}:${config.port}"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
`;
  }

  static generateDeploymentConfig(
    framework: string,
    projectName: string,
    customConfig?: Partial<FrameworkConfig>
  ): DockerConfig {
    return {
      dockerfile: this.generateDockerfile(framework, customConfig),
      captainDefinition: this.generateCaptainDefinition(framework, customConfig),
      dockerCompose: this.generateDockerCompose(framework, projectName, customConfig)
    };
  }

  static detectFramework(packageJson: any): string {
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies.next) return 'nextjs';
    if (dependencies.react && !dependencies.next) return 'react';
    if (dependencies.vue) return 'vue';
    if (dependencies['@angular/core']) return 'angular';
    if (dependencies.express) return 'node';
    
    return 'static';
  }

  static getSupportedFrameworks(): string[] {
    return Object.keys(frameworkConfigs);
  }

  static getFrameworkConfig(framework: string): FrameworkConfig | null {
    return frameworkConfigs[framework] || null;
  }
}