import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Edit3, 
  Camera, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Crown,
  Star,
  Trophy,
  Target,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: "John Adebayo",
    email: "john.adebayo@email.com",
    phone: "+234 801 234 5678",
    nin: "12345678901",
    level: "Growth",
    joinDate: "March 2024",
    avatar: "",
    location: "Lagos, Nigeria"
  });

  const [achievements] = useState([
    { id: 1, title: "First Referral", description: "Made your first referral", earned: true, icon: Star },
    { id: 2, title: "Level Up", description: "Reached Growth level", earned: true, icon: Crown },
    { id: 3, title: "Top Performer", description: "Top 10 earner this month", earned: false, icon: Trophy },
    { id: 4, title: "Chain Master", description: "Complete 5 full chains", earned: false, icon: Target }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleChangeAvatar = () => {
    toast({
      title: "Change Avatar",
      description: "Avatar upload functionality coming soon",
    });
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-primary">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-2xl">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="sm"
            onClick={handleChangeAvatar}
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary p-0"
          >
            <Camera size={14} />
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-gradient-success text-secondary-foreground">
              {userProfile.level} Level
            </Badge>
            <Badge variant="outline">
              Member since {userProfile.joinDate}
            </Badge>
          </div>
        </div>
      </header>

      {/* Profile Information */}
      <Card className="p-6 space-y-4 bg-gradient-card shadow-card border-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Profile Information</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit3 size={16} />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={userProfile.location}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nin" className="text-sm font-medium">NIN</Label>
              <Input
                id="nin"
                value={userProfile.nin}
                disabled
                className="mt-1 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">NIN cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSaveProfile} className="w-full bg-gradient-primary">
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 space-y-4 bg-gradient-card shadow-card border-0">
        <h3 className="font-bold text-foreground">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`p-3 rounded-xl border-2 text-center space-y-2 transition-all duration-300 ${
                  achievement.earned 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-muted bg-muted/50 text-muted-foreground'
                }`}
              >
                <Icon size={24} className="mx-auto" />
                <div>
                  <p className="font-semibold text-xs">{achievement.title}</p>
                  <p className="text-xs opacity-80">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 space-y-4 bg-gradient-card shadow-card border-0">
        <h3 className="font-bold text-foreground">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get instant alerts</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive SMS updates</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">Product updates and promotions</p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between h-12"
        >
          <div className="flex items-center gap-3">
            <Settings size={20} />
            <span>App Settings</span>
          </div>
          <ChevronRight size={16} />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between h-12"
        >
          <div className="flex items-center gap-3">
            <Shield size={20} />
            <span>Privacy & Security</span>
          </div>
          <ChevronRight size={16} />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between h-12"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Logout Button */}
      <Button 
        onClick={handleLogout}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  );
};

export default Profile;