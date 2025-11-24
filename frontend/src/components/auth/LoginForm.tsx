import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("role", response.data.data.role);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900/70 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Login Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Label htmlFor="username" className="sr-only">Username</Label>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input id="username" placeholder="Username or Email" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 transition" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Label htmlFor="password"className="sr-only">Password</Label>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input id="password" type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 transition" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button className="w-full flex justify-center items-center gap-2" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            <ArrowRight />
          </Button>
          <div className="text-center mt-4">
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Forgot password?</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
    
export default LoginForm;
