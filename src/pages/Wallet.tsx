import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Plus,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Calendar
} from "lucide-react";
import EarningsCard from "@/components/EarningsCard";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const [walletData] = useState({
    totalEarnings: 45000,
    availableBalance: 12500,
    pendingWithdrawals: 8000,
    totalWithdrawn: 24500
  });

  const [transactions] = useState([
    { 
      id: 1, 
      type: "earning", 
      amount: 500, 
      description: "L2 Referral Commission", 
      date: "2024-08-15T10:30:00Z", 
      status: "completed",
      from: "Michael Chen"
    },
    { 
      id: 2, 
      type: "withdrawal", 
      amount: -5000, 
      description: "Bank Transfer", 
      date: "2024-08-14T15:45:00Z", 
      status: "pending",
      to: "GTBank ****1234"
    },
    { 
      id: 3, 
      type: "earning", 
      amount: 200, 
      description: "L1 Referral Commission", 
      date: "2024-08-14T09:15:00Z", 
      status: "completed",
      from: "Sarah Johnson"
    },
    { 
      id: 4, 
      type: "activation", 
      amount: -3000, 
      description: "Chain Activation Fee", 
      date: "2024-08-13T14:20:00Z", 
      status: "completed",
      to: "Elevatex System"
    },
    { 
      id: 5, 
      type: "earning", 
      amount: 150, 
      description: "L3 Referral Commission", 
      date: "2024-08-12T11:30:00Z", 
      status: "completed",
      from: "David Okafor"
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-secondary';
      case 'pending': return 'text-accent';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-secondary" />;
      case 'pending': return <Clock size={16} className="text-accent" />;
      case 'failed': return <XCircle size={16} className="text-destructive" />;
      default: return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !selectedBank) {
      toast({
        title: "Missing Information",
        description: "Please fill in all withdrawal details",
        variant: "destructive"
      });
      return;
    }

    if (Number(withdrawAmount) > walletData.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough available balance",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal Requested! 💸",
      description: `₦${withdrawAmount} withdrawal request submitted`,
    });
    
    setWithdrawAmount("");
    setSelectedBank("");
  };

  const handleAddFunds = () => {
    toast({
      title: "Add Funds",
      description: "Redirecting to payment gateway...",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your earnings and withdrawals
        </p>
      </header>

      {/* Wallet Summary */}
      <div className="grid gap-3">
        <EarningsCard
          title="Available Balance"
          amount={walletData.availableBalance}
          icon={CreditCard}
          variant="primary"
          trend={12.5}
        />
        <div className="grid grid-cols-2 gap-3">
          <EarningsCard
            title="Total Earned"
            amount={walletData.totalEarnings}
            icon={ArrowUpCircle}
            variant="success"
          />
          <EarningsCard
            title="Pending"
            amount={walletData.pendingWithdrawals}
            icon={Clock}
            variant="warning"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleAddFunds}
          className="flex items-center gap-2 h-12 bg-gradient-primary"
        >
          <Plus size={18} />
          Add Funds
        </Button>
        <Button 
          onClick={() => {
            // Scroll to withdrawal section
            document.getElementById('withdrawal-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          variant="outline"
          className="flex items-center gap-2 h-12 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
        >
          <ArrowDownCircle size={18} />
          Withdraw
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar size={16} />
              Date Range
            </Button>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 shadow-card border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'earning' ? 'bg-secondary/20' :
                      transaction.type === 'withdrawal' ? 'bg-primary/20' :
                      'bg-accent/20'
                    }`}>
                      {transaction.type === 'earning' ? (
                        <ArrowDownCircle className="text-secondary" size={20} />
                      ) : transaction.type === 'withdrawal' ? (
                        <ArrowUpCircle className="text-primary" size={20} />
                      ) : (
                        <Plus className="text-accent" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {formatDate(transaction.date)}
                        </span>
                      </div>
                      {transaction.from && (
                        <p className="text-xs text-muted-foreground mt-1">From: {transaction.from}</p>
                      )}
                      {transaction.to && (
                        <p className="text-xs text-muted-foreground mt-1">To: {transaction.to}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount > 0 ? 'text-secondary' : 'text-foreground'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4" id="withdrawal-section">
          <Card className="p-6 space-y-4 bg-gradient-card shadow-card border-0">
            <h3 className="font-bold text-foreground">Request Withdrawal</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available balance: ₦{walletData.availableBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="bank">Bank Account</Label>
                <select 
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">Select bank account</option>
                  <option value="gtbank">GTBank - ****1234</option>
                  <option value="access">Access Bank - ****5678</option>
                  <option value="zenith">Zenith Bank - ****9012</option>
                </select>
              </div>

              <Button 
                onClick={handleWithdraw}
                className="w-full bg-gradient-primary"
                disabled={!withdrawAmount || !selectedBank}
              >
                <ArrowDownCircle className="mr-2" size={16} />
                Request Withdrawal
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Withdrawals are processed within 24-48 hours on business days
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;