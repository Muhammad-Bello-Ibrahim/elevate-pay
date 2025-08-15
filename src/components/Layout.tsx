import { useState } from "react";
import { Home, Users, Wallet, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Dashboard from "@/pages/Dashboard";
import Referrals from "@/pages/Referrals";
import WalletPage from "@/pages/Wallet";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home, component: Dashboard },
    { id: "referrals", label: "Referrals", icon: Users, component: Referrals },
    { id: "wallet", label: "Wallet", icon: Wallet, component: WalletPage },
    { id: "notifications", label: "Notifications", icon: Bell, component: Notifications },
    { id: "profile", label: "Profile", icon: User, component: Profile },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-md border-t border-border px-4 py-2 shadow-lg z-50">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform",
                  isActive 
                    ? "bg-gradient-primary text-primary-foreground shadow-primary scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                )}
              >
                <Icon size={20} className={cn("mb-1", isActive && "animate-pulse-glow")} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;