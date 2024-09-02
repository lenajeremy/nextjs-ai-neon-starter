"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function Component() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignin = async () => {
    setLoading(true);
    try {
      const res = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });
      alert(res);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Email sent. Check your inbox.");
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignin = async () => {
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      toast.error(String(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account or sign in with a provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#08193b] hover:bg-blue-900 text-white w-full"
            type="submit"
            onClick={handleEmailSignin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up with Email"}
          </Button>
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
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" onClick={handleGithubSignin}>
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
