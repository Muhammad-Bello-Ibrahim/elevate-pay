import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: (phone: string, password: string) => void;
  onForgotPassword: () => void;
  onSignup: () => void;
}

const Login = ({ onLogin, onForgotPassword, onSignup }: LoginProps) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(phone, password);
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in to Elevatex",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-card/95 backdrop-blur-sm shadow-card border-0">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary-foreground">E</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue elevating</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-primary-foreground shadow-primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="text-center">
          <button
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={onSignup}
              className="text-primary font-medium hover:underline"
              disabled={isLoading}
            >
              Sign up now
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;