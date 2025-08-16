import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSent: (contact: string) => void;
}

const ForgotPassword = ({ onBack, onResetSent }: ForgotPasswordProps) => {
  const { toast } = useToast();
  const [contact, setContact] = useState("");
  const [resetMethod, setResetMethod] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact) {
      toast({
        title: "Missing Information",
        description: `Please enter your ${resetMethod === "phone" ? "phone number" : "email address"}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onResetSent(contact);
      toast({
        title: "Reset Code Sent! 📱",
        description: `Password reset code sent to your ${resetMethod}`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-card/95 backdrop-blur-sm shadow-card border-0">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground">We'll send you a reset code</p>
          </div>
        </div>

        {/* Reset Method Toggle */}
        <div className="flex space-x-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setResetMethod("phone")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              resetMethod === "phone"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={isLoading}
          >
            <Phone size={16} className="inline mr-2" />
            Phone
          </button>
          <button
            onClick={() => setResetMethod("email")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              resetMethod === "email"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={isLoading}
          >
            <Mail size={16} className="inline mr-2" />
            Email
          </button>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact">
              {resetMethod === "phone" ? "Phone Number" : "Email Address"}
            </Label>
            <div className="relative">
              {resetMethod === "phone" ? (
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              ) : (
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="contact"
                type={resetMethod === "phone" ? "tel" : "email"}
                placeholder={
                  resetMethod === "phone" 
                    ? "08012345678" 
                    : "john@example.com"
                }
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-primary-foreground shadow-primary"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>

        {/* Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            {resetMethod === "phone" 
              ? "We'll send a 6-digit verification code to your phone number"
              : "We'll send a reset link to your email address"
            }
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;