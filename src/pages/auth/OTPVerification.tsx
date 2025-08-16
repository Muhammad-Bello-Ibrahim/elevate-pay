import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
  onBack: () => void;
  onResendOTP: () => void;
}

const OTPVerification = ({ phone, onVerificationComplete, onBack, onResendOTP }: OTPVerificationProps) => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (value: string) => {
    setOtp(value);
    
    // Auto-verify when OTP is complete
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = async (otpValue = otp) => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, accept any 6-digit code
      onVerificationComplete();
      toast({
        title: "Verification Successful! ✅",
        description: "Your phone number has been verified",
      });
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    onResendOTP();
    setCountdown(60);
    setCanResend(false);
    setOtp("");
    
    toast({
      title: "OTP Resent 📱",
      description: "A new verification code has been sent",
    });
  };

  const maskedPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

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
            <h1 className="text-2xl font-bold text-foreground">Verify Phone</h1>
            <p className="text-muted-foreground">Enter the code we sent</p>
          </div>
        </div>

        {/* Phone Info */}
        <div className="flex items-center justify-center space-x-3 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Phone size={18} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Code sent to</p>
            <p className="font-medium text-foreground">{maskedPhone}</p>
          </div>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <div className="text-center">
            <label className="text-sm font-medium text-foreground">
              Enter 6-digit verification code
            </label>
          </div>
          
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={handleOTPChange}
              maxLength={6}
              disabled={isLoading}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold border-2" />
                <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold border-2" />
                <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold border-2" />
                <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold border-2" />
                <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold border-2" />
                <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold border-2" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Verify Button */}
        <Button 
          onClick={() => handleVerify()}
          className="w-full bg-gradient-primary text-primary-foreground shadow-primary"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        {/* Resend */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-sm text-primary font-medium hover:underline"
              disabled={isLoading}
            >
              Resend Code
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend in {countdown}s
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OTPVerification;