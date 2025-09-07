import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeployHub
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 New: Auto Docker Generation
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Deploy Applications
            <br />
            Like Never Before
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Modern deployment platform with GitHub integration, auto-generated Docker configs, 
            and seamless CapRover deployment. Deploy your apps in seconds, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Deploying Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Features
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Deploy in under 30 seconds</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">Auto Configuration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Automatic Docker & config generation</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold mb-2">GitHub Integration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Import and deploy from GitHub directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features to streamline your deployment workflow from development to production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <CardTitle>One-Click Deploy</CardTitle>
                <CardDescription>
                  Deploy your applications with a single click. No complex configurations needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🔗</span>
                </div>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  Connect your GitHub repositories and deploy directly from your favorite repos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🐳</span>
                </div>
                <CardTitle>Auto Docker Generation</CardTitle>
                <CardDescription>
                  Automatically generate optimized Dockerfiles and deployment configurations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">⚙️</span>
                </div>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Secure environment variable management with encryption and easy updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Monitor your deployments with real-time logs and performance metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with encrypted data storage and secure deployments.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for personal projects</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-lg text-slate-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    3 Projects
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    GitHub Integration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Auto Docker Generation
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Basic Support
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing teams and businesses</CardDescription>
                <div className="text-3xl font-bold">$29<span className="text-lg text-slate-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Unlimited Projects
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Advanced GitHub Features
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Custom Domains
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Priority Support
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Team Collaboration
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Deploy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who trust DeployHub for their deployments.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Start Deploying Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeployHub
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              © 2024 DeployHub. Modern deployment platform for modern developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}