import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';

// Memoized components for performance
const ActivityItem = React.memo(({ item }: { item: any }) => {
  const styles = useThemedStyles();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'referral': return 'people';
      case 'earning': return 'cash';
      case 'placement': return 'link';
      case 'level': return 'trophy';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'referral': return '#8B5CF6'; // Neon purple
      case 'earning': return '#10B981'; // Neon green
      case 'placement': return '#00FFFF'; // Neon cyan
      case 'level': return '#E879F9'; // Hot pink
      default: return '#6B7280';
    }
  };

  return (
    <View className={`p-4 mb-3 rounded-xl border border-white/10 ${styles.glass}`}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-3">
          <Ionicons name={getIcon(item.type)} size={20} color={getIconColor(item.type)} />
        </View>
        <View className="flex-1">
          <Text className="text-white font-medium text-sm">{item.message}</Text>
          <Text className="text-gray-400 text-xs mt-1">{item.time}</Text>
        </View>
      </View>
    </View>
  );
});

const StatsCard = React.memo(({ title, value, icon, gradient }: {
  title: string;
  value: string;
  icon: string;
  gradient: string;
}) => {
  return (
    <TouchableOpacity 
      className={`flex-1 p-4 rounded-xl border border-white/10 mx-2 ${gradient}`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white/80 text-xs font-medium">{title}</Text>
          <Text className="text-white text-xl font-bold mt-1">{value}</Text>
        </View>
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name={icon as any} size={18} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const styles = useThemedStyles();
  const [refreshing, setRefreshing] = useState(false);

  const recentActivities = useMemo(() => [
    { id: '1', type: 'referral', message: 'New referral: Sarah joined your network', time: '2 min ago' },
    { id: '2', type: 'earning', message: '₦500 earned from L2 referral', time: '1 hour ago' },
    { id: '3', type: 'placement', message: 'Auto-placed in Chain #4521', time: '3 hours ago' },
    { id: '4', type: 'level', message: 'Congratulations! Level upgraded to Growth', time: '1 day ago' }
  ], []);

  useEffect(() => {
    if (user) {
      // Welcome notification
      const timer = setTimeout(() => {
        Alert.alert(
          `Welcome back to ElevateX, ${user.name.split(' ')[0]}! 🚀`,
          `You're ${user.totalRequired - user.membersReferred} referrals away from completing your chain.`,
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleActivate = useCallback(() => {
    Alert.alert(
      'Activate Account',
      'Would you like to activate your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Activate', onPress: () => Alert.alert('Success', 'Account activated!') }
      ]
    );
  }, []);

  const handleWithdraw = useCallback(() => {
    if (!user?.isActivated || (user?.availableBalance || 0) < 1000) {
      Alert.alert('Withdrawal Not Available', 'Account must be activated and have minimum balance of ₦1,000');
      return;
    }
    Alert.alert(
      'Withdraw Funds',
      `Available balance: ₦${user?.availableBalance?.toLocaleString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Withdraw', onPress: () => Alert.alert('Success', 'Withdrawal request submitted!') }
      ]
    );
  }, [user]);

  const handleRefer = useCallback(() => {
    Alert.alert('Referral Link Copied! 📋', 'Share with friends to grow your network');
  }, []);

  const renderActivity = useCallback(({ item }: { item: any }) => (
    <ActivityItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80, // Approximate height of each activity item
      offset: 80 * index,
      index,
    }),
    []
  );

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-brand-dark">
        <View className="p-8 rounded-xl bg-white/10 backdrop-blur-md">
          <Text className="text-white text-lg font-semibold">Loading ElevateX...</Text>
        </View>
      </View>
    );
  }

  const ListHeaderComponent = useMemo(() => (
    <View className="bg-brand-dark">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-gradient-to-r from-brand-darker to-brand-navy">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple items-center justify-center mr-3">
            <Text className="text-white font-bold text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text className="text-white text-lg font-semibold">Hello, {user.name.split(' ')[0]}!</Text>
            <Text className="text-neon-cyan text-sm font-medium">Ready to elevate? 🚀</Text>
          </View>
        </View>
        <View className="px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30">
          <Text className="text-neon-purple font-semibold text-xs">{user.level} Level</Text>
        </View>
      </View>

      {/* Chain Progress Card */}
      <View className="mx-4 mt-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20">
        <Text className="text-white text-lg font-bold mb-4">Chain Progress</Text>
        
        <View className="items-center mb-4">
          <View className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple items-center justify-center mb-2">
            <Text className="text-white text-xl font-bold">{user.chainProgress}%</Text>
          </View>
          <Text className="text-gray-300 text-sm">Complete</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-white text-base">
            <Text className="font-bold text-neon-cyan">{user.membersReferred}/{user.totalRequired}</Text> members in your chain
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {user.totalRequired - user.membersReferred} more referrals to complete cycle
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="mx-4 mt-4">
        <Text className="text-white text-lg font-bold mb-3">Earnings Summary</Text>
        
        <View className="mb-4 p-4 rounded-xl bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-white/10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white/80 text-sm font-medium">Total Earnings</Text>
              <Text className="text-white text-2xl font-bold">₦{user.totalEarnings.toLocaleString()}</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="trending-up" size={24} color="#00FFFF" />
            </View>
          </View>
        </View>

        <View className="flex-row space-x-3">
          <StatsCard
            title="Available"
            value={`₦${user.availableBalance.toLocaleString()}`}
            icon="wallet"
            gradient="bg-gradient-to-br from-neon-green/20 to-neon-green/10"
          />
          <StatsCard
            title="Pending"
            value={`₦${user.pendingWithdrawals.toLocaleString()}`}
            icon="time"
            gradient="bg-gradient-to-br from-neon-orange/20 to-neon-orange/10"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mx-4 mt-6">
        <Text className="text-white text-lg font-bold mb-3">Quick Actions</Text>
        
        <View className="flex-row space-x-3 mb-6">
          {!user.isActivated ? (
            <TouchableOpacity 
              className="flex-1 p-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple items-center"
              onPress={handleActivate}
              activeOpacity={0.8}
            >
              <Ionicons name="rocket" size={24} color="white" />
              <Text className="text-white font-bold mt-2">Activate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="flex-1 p-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink items-center"
              onPress={handleRefer}
              activeOpacity={0.8}
            >
              <Ionicons name="share" size={24} color="white" />
              <Text className="text-white font-bold mt-2">Refer</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            className={`flex-1 p-4 rounded-xl border border-white/20 items-center ${
              (!user.isActivated || user.availableBalance < 1000) 
                ? 'bg-gray-800/50' 
                : 'bg-white/10'
            }`}
            onPress={handleWithdraw}
            disabled={!user.isActivated || user.availableBalance < 1000}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="arrow-down-circle" 
              size={24} 
              color={(!user.isActivated || user.availableBalance < 1000) ? "#6B7280" : "#10B981"} 
            />
            <Text className={`font-bold mt-2 ${
              (!user.isActivated || user.availableBalance < 1000) 
                ? 'text-gray-400' 
                : 'text-neon-green'
            }`}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Header */}
      <View className="mx-4 mb-4">
        <Text className="text-white text-lg font-bold">Recent Activity</Text>
      </View>
    </View>
  ), [user, handleActivate, handleRefer, handleWithdraw]);

  return (
    <FlatList
      className="flex-1 bg-brand-dark"
      data={recentActivities}
      renderItem={renderActivity}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#00FFFF"
          colors={["#00FFFF"]}
        />
      }
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
};

export default Dashboard;