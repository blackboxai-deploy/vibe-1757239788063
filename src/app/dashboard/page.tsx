"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

interface Project {
  id: number;
  name: string;
  repository_url?: string;
  framework?: string;
  created_at: string;
  updated_at: string;
}

interface Deployment {
  id: number;
  project_id: number;
  status: 'pending' | 'building' | 'success' | 'failed';
  deploy_url?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentDeployments, setRecentDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch projects
      const projectsResponse = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      // Fetch recent deployments
      const deploymentsResponse = await fetch('/api/deployments/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (deploymentsResponse.ok) {
        const deploymentsData = await deploymentsResponse.json();
        setRecentDeployments(deploymentsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'building': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'building': return '🔄';
      default: return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {projects.length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Active deployments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Successful Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {recentDeployments.filter(d => d.status === 'success').length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Builds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {recentDeployments.filter(d => d.status === 'building').length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Currently building
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your next deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/create">
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <span className="text-xl">➕</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Create New Project</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Start a new deployment project
                    </div>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/import">
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Import from GitHub</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Deploy existing repository
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest deployment projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-slate-600 dark:text-slate-400">
                  No projects yet. Create your first project to get started!
                </p>
                <Link href="/dashboard/create" className="mt-4 inline-block">
                  <Button size="sm">Create Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {project.framework || 'Unknown framework'}
                        </div>
                      </div>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deployments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
            <CardDescription>
              Latest deployment activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeployments.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-4">🚀</div>
                <p className="text-slate-600 dark:text-slate-400">
                  No deployments yet. Deploy your first project!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDeployments.slice(0, 5).map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getStatusEmoji(deployment.status)}
                      </span>
                      <div>
                        <div className="font-medium">
                          Deployment #{deployment.id}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(deployment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(deployment.status)}>
                      {deployment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}