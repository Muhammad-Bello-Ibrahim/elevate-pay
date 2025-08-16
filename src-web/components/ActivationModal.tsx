import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivationModal = ({ isOpen, onClose }: ActivationModalProps) => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'payment' | 'processing' | 'success'>('payment');

  const activationFee = 3000;

  const handlePayment = async () => {
    setIsProcessing(true);
    setCurrentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setCurrentStep('success');
      if (user) {
        updateUser({ isActivated: true });
      }
      toast({
        title: "Activation Successful! 🎉",
        description: "Your account has been activated. You can now start earning!",
      });
      
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('payment');
        onClose();
      }, 2000);
    }, 3000);
  };

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <CreditCard className="text-primary-foreground" size={24} />
        </div>
        <h3 className="text-lg font-bold">Activate Your Account</h3>
        <p className="text-muted-foreground text-sm">
          Pay the one-time activation fee to start earning
        </p>
      </div>

      <Card className="p-4 bg-muted/30">
        <div className="flex justify-between items-center">
          <span className="font-medium">Activation Fee</span>
          <span className="text-xl font-bold text-primary">₦{activationFee.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          One-time payment • Secure payment gateway
        </p>
      </Card>

      <div className="space-y-3">
        <Label>Payment Method</Label>
        <div className="grid gap-3">
          <Card className="p-3 border-2 border-primary bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-sm">Paystack</p>
                  <p className="text-xs text-muted-foreground">Card, Bank Transfer, USSD</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Recommended</Badge>
            </div>
          </Card>

          <Card className="p-3 border">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Flutterwave</p>
                <p className="text-xs text-muted-foreground">Card, Bank Transfer</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handlePayment} className="flex-1 bg-gradient-primary">
          Pay ₦{activationFee.toLocaleString()}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield size={14} />
        <span>Secured by 256-bit SSL encryption</span>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
        <CreditCard className="text-primary-foreground" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold">Processing Payment</h3>
        <p className="text-muted-foreground text-sm">
          Please wait while we process your payment...
        </p>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="text-secondary-foreground" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-secondary">Payment Successful!</h3>
        <p className="text-muted-foreground text-sm">
          Your account has been activated. Welcome to Elevatex!
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Account Activation</DialogTitle>
            {!isProcessing && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default ActivationModal;