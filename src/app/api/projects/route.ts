import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async (_request: NextRequest, user) => {
  try {
    const db = new DatabaseService();
    const projects = await db.getProjectsByUserId(user.userId);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const projectData = await request.json();

    // Validate required fields
    if (!projectData.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const db = new DatabaseService();
    
    // Set defaults
    const project = {
      name: projectData.name,
      repository_url: projectData.repository_url || null,
      branch: projectData.branch || 'main',
      build_command: projectData.build_command || 'npm run build',
      install_command: projectData.install_command || 'npm install',
      output_directory: projectData.output_directory || 'dist',
      framework: projectData.framework || null
    };

    const projectId = await db.createProject(user.userId, project);

    return NextResponse.json(
      { message: 'Project created successfully', projectId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});