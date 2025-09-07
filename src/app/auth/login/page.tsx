"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DeployHub
            </span>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full" disabled={loading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024.557-.085-.003-.204-.003-.446v-1.545c-3.179.685-3.85-1.538-3.85-1.538-.505-1.281-1.233-1.622-1.233-1.622-1.009-.689.076-.676.076-.676 1.115.078 1.7 1.145 1.7 1.145.991 1.698 2.598 1.207 3.231.923.101-.719.388-1.207.706-1.485-2.464-.28-5.056-1.233-5.056-5.492 0-1.213.432-2.205 1.14-2.984-.114-.281-.494-1.411.108-2.94 0 0 .930-.298 3.048 1.139a10.533 10.533 0 0 1 2.777-.373c.942.004 1.892.127 2.777.373 2.118-1.437 3.047-1.139 3.047-1.139.603 1.529.223 2.659.110 2.94.709.779 1.139 1.771 1.139 2.984 0 4.270-2.597 5.209-5.067 5.485.398.342.753 1.017.753 2.049v3.035c0 .25-.442.364.007.442C20.883 21.4 24.041 17.062 24.041 11.987 24.041 5.367 18.674.001 12.017.001Z"
                />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-primary">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}