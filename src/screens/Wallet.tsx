import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';

// Transaction interface
interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Memoized transaction item component
const TransactionItem = React.memo(({ item }: { item: Transaction }) => {
  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle';
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? '#10B981' : '#EF4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View className="p-4 mb-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-3">
            <Ionicons 
              name={getTransactionIcon(item.type)} 
              size={20} 
              color={getTransactionColor(item.type)} 
            />
          </View>
          
          <View className="flex-1">
            <Text className="text-white font-medium text-sm" numberOfLines={1}>
              {item.description}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">{item.date}</Text>
          </View>
        </View>
        
        <View className="items-end">
          <Text className={`font-bold text-base ${
            item.type === 'credit' ? 'text-neon-green' : 'text-red-400'
          }`}>
            {item.type === 'credit' ? '+' : '-'}₦{item.amount.toLocaleString()}
          </Text>
          <View className={`px-2 py-1 rounded-full mt-1`} style={{ 
            backgroundColor: `${getStatusColor(item.status)}20`
          }}>
            <Text className="text-xs capitalize" style={{ 
              color: getStatusColor(item.status) 
            }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

// Quick action button component
const QuickActionButton = React.memo(({ 
  icon, 
  label, 
  onPress, 
  gradient,
  disabled = false 
}: {
  icon: string;
  label: string;
  onPress: () => void;
  gradient: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity 
    className={`flex-1 p-4 rounded-xl mx-1 items-center ${
      disabled ? 'bg-gray-800/50' : gradient
    }`}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <Ionicons 
      name={icon as any} 
      size={24} 
      color={disabled ? "#6B7280" : "white"} 
    />
    <Text className={`font-semibold mt-2 text-sm ${
      disabled ? 'text-gray-400' : 'text-white'
    }`}>
      {label}
    </Text>
  </TouchableOpacity>
));

const WalletScreen = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const styles = useThemedStyles();
  const [refreshing, setRefreshing] = useState(false);

  const transactions = useMemo(() => [
    { id: '1', type: 'credit' as const, amount: 2500, description: 'Referral bonus from Sarah', date: '2024-02-15', status: 'completed' as const },
    { id: '2', type: 'debit' as const, amount: 5000, description: 'Withdrawal to bank account', date: '2024-02-10', status: 'completed' as const },
    { id: '3', type: 'credit' as const, amount: 1800, description: 'Level 2 commission', date: '2024-02-08', status: 'completed' as const },
    { id: '4', type: 'credit' as const, amount: 3200, description: 'Referral bonus from Mike', date: '2024-02-05', status: 'pending' as const },
    { id: '5', type: 'debit' as const, amount: 1200, description: 'Bill payment - Electricity', date: '2024-02-03', status: 'completed' as const },
    { id: '6', type: 'credit' as const, amount: 4500, description: 'P2P transfer received', date: '2024-02-01', status: 'completed' as const },
  ], []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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

  const handleTopUp = useCallback(() => {
    Alert.alert('Top Up Wallet', 'Choose your preferred payment method:', [
      { text: 'Bank Transfer', onPress: () => Alert.alert('Bank Transfer', 'Feature coming soon!') },
      { text: 'Card Payment', onPress: () => Alert.alert('Card Payment', 'Feature coming soon!') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  }, []);

  const handleSend = useCallback(() => {
    Alert.alert('Send Money', 'P2P transfer feature coming soon!');
  }, []);

  const handleBuyAirtime = useCallback(() => {
    Alert.alert('Buy Airtime', 'Airtime purchase feature coming soon!');
  }, []);

  const renderTransaction = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 90, // Approximate height of each transaction item
      offset: 90 * index,
      index,
    }),
    []
  );

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-brand-dark">
        <View className="p-8 rounded-xl bg-white/10 backdrop-blur-md">
          <Text className="text-white text-lg font-semibold">Loading Wallet...</Text>
        </View>
      </View>
    );
  }

  const ListHeaderComponent = useMemo(() => (
    <View className="bg-brand-dark">
      {/* Balance Card */}
      <View className="mx-4 mt-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20">
        <Text className="text-white text-lg font-bold mb-4">Wallet Balance</Text>
        
        <View className="items-center mb-6">
          <Text className="text-gray-300 text-sm mb-2">Total Balance</Text>
          <Text className="text-white text-4xl font-bold">
            ₦{((user?.availableBalance || 0) + (user?.pendingWithdrawals || 0)).toLocaleString()}
          </Text>
        </View>
        
        <View className="flex-row space-x-4">
          <View className="flex-1 p-4 rounded-xl bg-neon-green/20 border border-neon-green/30">
            <Text className="text-neon-green text-xs font-medium">Available</Text>
            <Text className="text-white text-lg font-bold mt-1">
              ₦{(user?.availableBalance || 0).toLocaleString()}
            </Text>
          </View>
          
          <View className="flex-1 p-4 rounded-xl bg-neon-orange/20 border border-neon-orange/30">
            <Text className="text-neon-orange text-xs font-medium">Pending</Text>
            <Text className="text-white text-lg font-bold mt-1">
              ₦{(user?.pendingWithdrawals || 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mx-4 mt-6">
        <Text className="text-white text-lg font-bold mb-4">Quick Actions</Text>
        
        <View className="flex-row mb-4">
          <QuickActionButton
            icon="add-circle"
            label="Top Up"
            onPress={handleTopUp}
            gradient="bg-gradient-to-r from-neon-cyan to-neon-purple"
          />
          
          <QuickActionButton
            icon="arrow-up-circle"
            label="Send"
            onPress={handleSend}
            gradient="bg-gradient-to-r from-neon-purple to-neon-pink"
          />
          
          <QuickActionButton
            icon="arrow-down-circle"
            label="Withdraw"
            onPress={handleWithdraw}
            gradient="bg-gradient-to-r from-neon-green to-neon-cyan"
            disabled={!user?.isActivated || (user?.availableBalance || 0) < 1000}
          />
        </View>
        
        <View className="flex-row">
          <QuickActionButton
            icon="phone-portrait"
            label="Airtime"
            onPress={handleBuyAirtime}
            gradient="bg-gradient-to-r from-neon-orange to-neon-pink"
          />
          
          <QuickActionButton
            icon="flash"
            label="Bills"
            onPress={() => Alert.alert('Pay Bills', 'Bill payment feature coming soon!')}
            gradient="bg-gradient-to-r from-neon-pink to-neon-purple"
          />
          
          <QuickActionButton
            icon="card"
            label="Cards"
            onPress={() => Alert.alert('Manage Cards', 'Card management feature coming soon!')}
            gradient="bg-gradient-to-r from-neon-purple to-neon-cyan"
          />
        </View>
      </View>

      {/* Transaction History Header */}
      <View className="mx-4 mt-6 mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">Recent Transactions</Text>
          <TouchableOpacity onPress={() => Alert.alert('View All', 'Full transaction history coming soon!')}>
            <Text className="text-neon-cyan text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [user, handleTopUp, handleSend, handleWithdraw, handleBuyAirtime]);

  return (
    <FlatList
      className="flex-1 bg-brand-dark"
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
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
      initialNumToRender={8}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default WalletScreen;