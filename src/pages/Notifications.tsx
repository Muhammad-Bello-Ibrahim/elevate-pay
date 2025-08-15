import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellRing, 
  Gift, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "earning",
      title: "New Commission Earned!",
      message: "You earned ₦500 from Michael Chen's L2 referral",
      time: "2 minutes ago",
      read: false,
      icon: TrendingUp,
      color: "text-secondary"
    },
    {
      id: 2,
      type: "referral",
      title: "New Referral Joined",
      message: "Sarah Johnson joined your network using your referral link",
      time: "1 hour ago",
      read: false,
      icon: Users,
      color: "text-primary"
    },
    {
      id: 3,
      type: "system",
      title: "Chain Progress Update",
      message: "You're now 67% complete in your current chain! 10 more to go.",
      time: "3 hours ago",
      read: true,
      icon: AlertCircle,
      color: "text-accent"
    },
    {
      id: 4,
      type: "achievement",
      title: "Level Up! 🎉",
      message: "Congratulations! You've been promoted to Growth level",
      time: "1 day ago",
      read: true,
      icon: Gift,
      color: "text-secondary"
    },
    {
      id: 5,
      type: "earning",
      title: "Withdrawal Processed",
      message: "Your ₦5,000 withdrawal has been successfully processed",
      time: "2 days ago",
      read: true,
      icon: CheckCircle2,
      color: "text-secondary"
    }
  ]);

  const [systemAnnouncements] = useState([
    {
      id: 1,
      title: "Platform Maintenance",
      message: "Scheduled maintenance on Sunday, August 18th from 2:00 AM - 4:00 AM WAT",
      date: "2024-08-15",
      priority: "medium"
    },
    {
      id: 2,
      title: "New Feature: QR Code Sharing",
      message: "You can now generate QR codes for your referral links! Check it out in the Referrals section.",
      date: "2024-08-14",
      priority: "low"
    },
    {
      id: 3,
      title: "Commission Structure Update",
      message: "Effective September 1st, L1 commissions increase from ₦200 to ₦250!",
      date: "2024-08-12",
      priority: "high"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification removed successfully",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs min-w-5 h-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </header>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <div className="flex gap-3">
          <Button 
            onClick={markAllAsRead}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            Settings
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs min-w-5 h-5 flex items-center justify-center p-0">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center space-y-4 bg-gradient-card shadow-card border-0">
              <Bell className="mx-auto w-12 h-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-foreground">No Notifications</h3>
                <p className="text-sm text-muted-foreground">You're all caught up! Check back later.</p>
              </div>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`p-4 shadow-card border-0 cursor-pointer transition-all duration-300 hover:shadow-primary/20 ${
                    !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-gradient-card'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center ${notification.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-3">
          {systemAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="p-4 shadow-card border-0 bg-gradient-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                    <Badge 
                      className={`text-xs ${getPriorityColor(announcement.priority)}`}
                      variant="secondary"
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                </div>
                <BellRing size={20} className="text-primary mt-1" />
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;