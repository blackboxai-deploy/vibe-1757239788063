"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        githubToken: user.githubToken || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        githubToken: user.githubToken || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="ml-64">
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Profile Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing || loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing || loading}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={handleCancel} disabled={loading}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Integration */}
              <Card>
                <CardHeader>
                  <CardTitle>GitHub Integration</CardTitle>
                  <CardDescription>
                    Connect your GitHub account to import repositories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                      <Input
                        id="githubToken"
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={formData.githubToken}
                        onChange={(e) => handleInputChange('githubToken', e.target.value)}
                        disabled={!isEditing || loading}
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Generate a token at{' '}
                        <a 
                          href="https://github.com/settings/tokens" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GitHub Settings
                        </a>{' '}
                        with repo access permissions
                      </p>
                    </div>

                    {formData.githubToken && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">GitHub token configured</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and subscription status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Account Role
                        </Label>
                        <p className="text-lg font-semibold capitalize">
                          {user.role}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Plan
                        </Label>
                        <p className="text-lg font-semibold">
                          Free Tier
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Projects
                        </Label>
                        <p className="text-lg font-semibold">
                          0 / 3
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Member Since
                        </Label>
                        <p className="text-lg font-semibold">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          Delete Account
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" disabled>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}