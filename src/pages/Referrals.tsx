import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Copy, 
  QrCode, 
  Users, 
  TreePine,
  Search,
  Plus,
  ChevronRight,
  Crown,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeDisplay from "@/components/QRCodeDisplay";

const Referrals = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  if (!user) return null;

  const [referralData] = useState({
    totalReferrals: 21,
    directReferrals: 8,
    systemAssigned: 13,
    referralLink: `https://elevatex.app/ref/${user.name.toLowerCase().replace(/\s+/g, '-')}-${user.id}`,
  });

  const [directReferrals] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", level: "Basic", earned: 1200, date: "2 days ago", avatar: "" },
    { id: 2, name: "Michael Chen", email: "michael@email.com", level: "Growth", earned: 3500, date: "5 days ago", avatar: "" },
    { id: 3, name: "Amina Hassan", email: "amina@email.com", level: "Basic", earned: 800, date: "1 week ago", avatar: "" },
    { id: 4, name: "David Okafor", email: "david@email.com", level: "Expansion", earned: 5200, date: "2 weeks ago", avatar: "" },
  ]);

  const [systemReferrals] = useState([
    { id: 5, name: "Grace Adamu", level: "Basic", earned: 200, placed: "Chain #4521", avatar: "" },
    { id: 6, name: "Ibrahim Musa", level: "Growth", earned: 450, placed: "Chain #4521", avatar: "" },
    { id: 7, name: "Joy Okwu", level: "Basic", earned: 150, placed: "Chain #4522", avatar: "" },
  ]);

  const filteredDirectReferrals = directReferrals.filter(ref => 
    ref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    toast({
      title: "Referral Link Copied! 📋",
      description: "Share this link with friends to earn commissions",
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Elevatex - Referral System",
        text: "Join me on Elevatex and start earning with our referral system!",
        url: referralData.referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  const generateQRCode = () => {
    setShowQRCode(!showQRCode);
    toast({
      title: "QR Code Generated! 📱",
      description: "QR code ready for sharing",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">My Referrals</h1>
        <p className="text-muted-foreground">
          Grow your network and earn more
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center bg-gradient-primary text-primary-foreground border-0">
          <Users className="mx-auto mb-2" size={20} />
          <p className="text-2xl font-bold">{referralData.totalReferrals}</p>
          <p className="text-xs opacity-90">Total</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-success text-secondary-foreground border-0">
          <Star className="mx-auto mb-2" size={20} />
          <p className="text-2xl font-bold">{referralData.directReferrals}</p>
          <p className="text-xs opacity-90">Direct</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-0">
          <TreePine className="mx-auto mb-2" size={20} />
          <p className="text-2xl font-bold">{referralData.systemAssigned}</p>
          <p className="text-xs opacity-90">System</p>
        </Card>
      </div>

      {/* Referral Actions */}
      <Card className="p-4 space-y-4 bg-gradient-card shadow-card border-0">
        <h3 className="font-bold text-foreground">Share Your Link</h3>
        
        <div className="flex items-center gap-2">
          <Input 
            value={referralData.referralLink}
            readOnly
            className="flex-1 bg-muted text-sm"
          />
          <Button size="sm" onClick={copyReferralLink} variant="outline">
            <Copy size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={shareReferralLink} className="bg-gradient-primary">
            <Share2 className="mr-2" size={16} />
            Share Link
          </Button>
          <Button onClick={generateQRCode} variant="outline" className="border-primary text-primary">
            <QrCode className="mr-2" size={16} />
            QR Code
          </Button>
        </div>
      </Card>

      {/* QR Code Display */}
      {showQRCode && (
        <QRCodeDisplay
          value={referralData.referralLink}
          title="Your Referral QR Code"
          size={180}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search referrals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Referrals Tabs */}
      <Tabs defaultValue="direct" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="direct">Direct Referrals</TabsTrigger>
          <TabsTrigger value="system">System Assigned</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-3">
          {filteredDirectReferrals.map((referral) => (
            <Card key={referral.id} className="p-4 shadow-card border-0 hover:shadow-primary/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={referral.avatar} alt={referral.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-sm">
                      {referral.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {referral.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{referral.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">₦{referral.earned.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="system" className="space-y-3">
          {systemReferrals.map((referral) => (
            <Card key={referral.id} className="p-4 shadow-card border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={referral.avatar} alt={referral.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {referral.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.placed}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {referral.level}
                  </Badge>
                  <p className="text-sm font-semibold text-secondary">₦{referral.earned}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Referrals;