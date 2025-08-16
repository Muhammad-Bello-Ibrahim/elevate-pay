import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Wallet, 
  ArrowDownCircle, 
  Plus, 
  Share2, 
  Zap,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import ProgressCircle from "@/components/ProgressCircle";
import EarningsCard from "@/components/EarningsCard";
import ActivationModal from "@/components/ActivationModal";
import WithdrawalModal from "@/components/WithdrawalModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  if (!user) return null;

  const [recentActivities] = useState([
    { type: "referral", message: "New referral: Sarah joined your network", time: "2 min ago" },
    { type: "earning", message: "₦500 earned from L2 referral", time: "1 hour ago" },
    { type: "placement", message: "Auto-placed in Chain #4521", time: "3 hours ago" },
    { type: "level", message: "Congratulations! Level upgraded to Growth", time: "1 day ago" }
  ]);

  useEffect(() => {
    // Welcome animation
    const timer = setTimeout(() => {
      toast({
        title: `Welcome back, ${user.name.split(' ')[0]}! 👋`,
        description: `You're ${user.totalRequired - user.membersReferred} referrals away from completing your chain.`,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleActivate = () => {
    setShowActivationModal(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
  };

  const handleRefer = () => {
    toast({
      title: "Referral Link Copied! 📋",
      description: "Share with friends to grow your network",
    });
  };

  return (
    <div className="p-4 pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold text-foreground">Hello, {user.name.split(' ')[0]}!</h1>
            <p className="text-sm text-muted-foreground">Ready to elevate? 🚀</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className="bg-gradient-success text-secondary-foreground border-0 px-3 py-1 font-bold"
        >
          {user.level} Level
        </Badge>
      </header>

      {/* Chain Progress */}
      <Card className="p-6 bg-gradient-card shadow-card border-0">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold text-foreground">Chain Progress</h3>
          <ProgressCircle 
            percentage={user.chainProgress} 
            label="Complete" 
          />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{user.membersReferred}/{user.totalRequired}</span> members in your chain
            </p>
            <p className="text-xs text-muted-foreground">
              {user.totalRequired - user.membersReferred} more referrals to complete cycle
            </p>
          </div>
        </div>
      </Card>

      {/* Earnings Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Earnings Summary</h3>
        <div className="grid gap-3">
          <EarningsCard
            title="Total Earnings"
            amount={user.totalEarnings}
            icon={TrendingUp}
            variant="primary"
            trend={15.2}
          />
          <div className="grid grid-cols-2 gap-3">
            <EarningsCard
              title="Available"
              amount={user.availableBalance}
              icon={Wallet}
              variant="success"
            />
            <EarningsCard
              title="Pending"
              amount={user.pendingWithdrawals}
              icon={Clock}
              variant="warning"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {!user.isActivated ? (
            <Button 
              onClick={handleActivate}
              className="flex flex-col items-center gap-2 h-auto py-4 bg-gradient-primary hover:shadow-primary transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} />
              <span className="text-xs">Activate</span>
            </Button>
          ) : (
            <Button 
              onClick={handleRefer}
              className="flex flex-col items-center gap-2 h-auto py-4 bg-gradient-primary hover:shadow-primary transition-all duration-300 hover:scale-105"
            >
              <Share2 size={20} />
              <span className="text-xs">Refer</span>
            </Button>
          )}
          
          <Button 
            onClick={handleWithdraw}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
            disabled={!user.isActivated || user.availableBalance < 1000}
          >
            <ArrowDownCircle size={20} />
            <span className="text-xs">Withdraw</span>
          </Button>
          
          <Button 
            onClick={handleRefer}
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            <Share2 size={20} />
            <span className="text-xs">Refer</span>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
        <Card className="p-0 overflow-hidden shadow-card border-0">
          <div className="divide-y divide-border">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'referral' ? 'bg-primary' :
                    activity.type === 'earning' ? 'bg-secondary' :
                    activity.type === 'placement' ? 'bg-accent' :
                    'bg-primary-glow'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ActivationModal 
        isOpen={showActivationModal} 
        onClose={() => setShowActivationModal(false)} 
      />
      <WithdrawalModal 
        isOpen={showWithdrawalModal} 
        onClose={() => setShowWithdrawalModal(false)} 
      />
    </div>
  );
};

export default Dashboard;