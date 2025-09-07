"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const frameworks = [
  { value: 'nextjs', label: 'Next.js', buildCommand: 'npm run build', outputDir: '.next' },
  { value: 'react', label: 'React', buildCommand: 'npm run build', outputDir: 'dist' },
  { value: 'vue', label: 'Vue.js', buildCommand: 'npm run build', outputDir: 'dist' },
  { value: 'angular', label: 'Angular', buildCommand: 'ng build', outputDir: 'dist' },
  { value: 'svelte', label: 'Svelte', buildCommand: 'npm run build', outputDir: 'dist' },
  { value: 'static', label: 'Static HTML', buildCommand: '', outputDir: '.' },
  { value: 'other', label: 'Other', buildCommand: 'npm run build', outputDir: 'dist' }
];

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    framework: '',
    buildCommand: 'npm run build',
    installCommand: 'npm install',
    outputDirectory: 'dist'
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFrameworkChange = (value: string) => {
    const framework = frameworks.find(f => f.value === value);
    if (framework) {
      setFormData(prev => ({
        ...prev,
        framework: value,
        buildCommand: framework.buildCommand,
        outputDirectory: framework.outputDir
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Project created successfully!');
        router.push(`/dashboard/projects/${result.projectId}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create project');
      }
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Create New Project
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Set up a new project for deployment. Configure your build settings and start deploying.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
          <CardDescription>
            Configure your project settings and deployment preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="my-awesome-project"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Framework Selection */}
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Select value={formData.framework} onValueChange={handleFrameworkChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework.value} value={framework.value}>
                      {framework.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Build Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Build Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installCommand">Install Command</Label>
                  <Input
                    id="installCommand"
                    placeholder="npm install"
                    value={formData.installCommand}
                    onChange={(e) => handleInputChange('installCommand', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildCommand">Build Command</Label>
                  <Input
                    id="buildCommand"
                    placeholder="npm run build"
                    value={formData.buildCommand}
                    onChange={(e) => handleInputChange('buildCommand', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputDirectory">Output Directory</Label>
                <Input
                  id="outputDirectory"
                  placeholder="dist"
                  value={formData.outputDirectory}
                  onChange={(e) => handleInputChange('outputDirectory', e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Directory where your build outputs are located
                </p>
              </div>
            </div>

            {/* Framework Info */}
            {formData.framework && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Framework Configuration
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  We&apos;ve automatically configured the build settings for {frameworks.find(f => f.value === formData.framework)?.label}. 
                  You can customize these settings if needed.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formData.name || !formData.framework}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}