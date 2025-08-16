import { useState } from "react";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import OTPVerification from "@/pages/auth/OTPVerification";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import { useAuth } from "@/contexts/AuthContext";

type AuthStep = 'login' | 'signup' | 'otp' | 'forgot-password';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated, isLoading, login, signup } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [tempUserData, setTempUserData] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">E</span>
          </div>
          <p className="text-muted-foreground">Loading Elevatex...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogin = async (phone: string, password: string) => {
    try {
      await login(phone, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (userData: {
    name: string;
    phone: string;
    email: string;
    nin: string;
    password: string;
  }) => {
    setTempUserData(userData);
    setAuthStep('otp');
  };

  const handleOTPVerification = async () => {
    if (tempUserData) {
      try {
        await signup(tempUserData);
        setTempUserData(null);
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };

  const handleForgotPassword = () => {
    setAuthStep('forgot-password');
  };

  const handleResetSent = (contact: string) => {
    // In a real app, this would handle the password reset flow
    console.log('Password reset sent to:', contact);
    setAuthStep('login');
  };

  const handleResendOTP = () => {
    // In a real app, this would resend the OTP
    console.log('Resending OTP to:', tempUserData?.phone);
  };

  const renderAuthStep = () => {
    switch (authStep) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            onSignup={() => setAuthStep('signup')}
          />
        );
      case 'signup':
        return (
          <Signup
            onSignup={handleSignup}
            onBack={() => setAuthStep('login')}
          />
        );
      case 'otp':
        return (
          <OTPVerification
            phone={tempUserData?.phone || ''}
            onVerificationComplete={handleOTPVerification}
            onBack={() => setAuthStep('signup')}
            onResendOTP={handleResendOTP}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onBack={() => setAuthStep('login')}
            onResetSent={handleResetSent}
          />
        );
      default:
        return null;
    }
  };

  return renderAuthStep();
};

export default AuthWrapper;