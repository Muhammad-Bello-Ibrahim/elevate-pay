import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CreditCard, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const banks = [
    { value: "gtbank", label: "GTBank - ****1234", account: "1234567890" },
    { value: "access", label: "Access Bank - ****5678", account: "5678901234" },
    { value: "zenith", label: "Zenith Bank - ****9012", account: "9012345678" },
  ];

  const handleWithdrawal = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > user.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive"
      });
      return;
    }

    if (!bankAccount) {
      toast({
        title: "Select Bank Account",
        description: "Please select a bank account for withdrawal",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newAvailableBalance = user.availableBalance - withdrawAmount;
      const newPendingWithdrawals = user.pendingWithdrawals + withdrawAmount;

      updateUser({
        availableBalance: newAvailableBalance,
        pendingWithdrawals: newPendingWithdrawals
      });

      toast({
        title: "Withdrawal Requested! 💸",
        description: `₦${withdrawAmount.toLocaleString()} withdrawal request submitted`,
      });

      setIsProcessing(false);
      setAmount("");
      setBankAccount("");
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Withdraw Funds</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Info */}
          <Card className="p-4 bg-gradient-success text-secondary-foreground">
            <div className="flex items-center gap-3">
              <Wallet size={20} />
              <div>
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-xl font-bold">₦{user.availableBalance.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">₦</span>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ₦1,000 • Maximum: ₦{user.availableBalance.toLocaleString()}
            </p>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label>Bank Account</Label>
            <Select value={bankAccount} onValueChange={setBankAccount} disabled={isProcessing}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.value} value={bank.value}>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      {bank.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning */}
          <Card className="p-3 border-accent/20 bg-accent/10">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-accent">Processing Time</p>
                <p className="text-muted-foreground text-xs">
                  Withdrawals are processed within 24-48 hours on business days.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleWithdrawal} 
              className="flex-1 bg-gradient-success"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Withdraw ₦${amount || "0"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;