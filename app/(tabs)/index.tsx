import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const ActivityItem = React.memo(({ item }: { item: any }) => {
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
      case 'referral': return '#8B5CF6';
      case 'earning': return '#10B981';
      case 'placement': return '#00FFFF';
      case 'level': return '#E879F9';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name={getIcon(item.type)} size={20} color={getIconColor(item.type)} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityMessage}>{item.message}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );
});

const StatsCard = React.memo(({ title, value, icon, gradient }: {
  title: string;
  value: string;
  icon: string;
  gradient: any;
}) => {
  return (
    <TouchableOpacity style={[styles.statsCard, gradient]} activeOpacity={0.8}>
      <View style={styles.statsCardContent}>
        <View>
          <Text style={styles.statsTitle}>{title}</Text>
          <Text style={styles.statsValue}>{value}</Text>
        </View>
        <View style={styles.statsIcon}>
          <Ionicons name={icon as any} size={18} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function Dashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const recentActivities = useMemo(() => [
    { id: '1', type: 'referral', message: 'New referral: Sarah joined your network', time: '2 min ago' },
    { id: '2', type: 'earning', message: '₦500 earned from L2 referral', time: '1 hour ago' },
    { id: '3', type: 'placement', message: 'Auto-placed in Chain #4521', time: '3 hours ago' },
    { id: '4', type: 'level', message: 'Congratulations! Level upgraded to Growth', time: '1 day ago' }
  ], []);

  useEffect(() => {
    if (user) {
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
      'Would you like to activate your account for ₦3,000?',
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

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading ElevateX...</Text>
        </View>
      </View>
    );
  }

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Hello, {user.name.split(' ')[0]}!</Text>
            <Text style={styles.subText}>Ready to elevate? 🚀</Text>
          </View>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{user.level} Level</Text>
        </View>
      </View>

      {/* Chain Progress Card */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Chain Progress</Text>
        
        <View style={styles.progressCircle}>
          <View style={styles.progressInner}>
            <Text style={styles.progressPercentage}>{user.chainProgress}%</Text>
          </View>
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressMembers}>
            <Text style={styles.progressHighlight}>{user.membersReferred}/{user.totalRequired}</Text> members in your chain
          </Text>
          <Text style={styles.progressRemaining}>
            {user.totalRequired - user.membersReferred} more referrals to complete cycle
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        
        <View style={styles.mainEarningsCard}>
          <View style={styles.earningsContent}>
            <View>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsAmount}>₦{user.totalEarnings.toLocaleString()}</Text>
            </View>
            <View style={styles.earningsIcon}>
              <Ionicons name="trending-up" size={24} color="#00FFFF" />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            title="Available"
            value={`₦${user.availableBalance.toLocaleString()}`}
            icon="wallet"
            gradient={styles.greenGradient}
          />
          <StatsCard
            title="Pending"
            value={`₦${user.pendingWithdrawals.toLocaleString()}`}
            icon="time"
            gradient={styles.orangeGradient}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsRow}>
          {!user.isActivated ? (
            <TouchableOpacity 
              style={styles.primaryAction}
              onPress={handleActivate}
              activeOpacity={0.8}
            >
              <Ionicons name="rocket" size={24} color="white" />
              <Text style={styles.actionText}>Activate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.primaryAction}
              onPress={handleRefer}
              activeOpacity={0.8}
            >
              <Ionicons name="share" size={24} color="white" />
              <Text style={styles.actionText}>Refer</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.secondaryAction,
              (!user.isActivated || user.availableBalance < 1000) && styles.disabledAction
            ]}
            onPress={handleWithdraw}
            disabled={!user.isActivated || user.availableBalance < 1000}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="arrow-down-circle" 
              size={24} 
              color={(!user.isActivated || user.availableBalance < 1000) ? "#6B7280" : "#10B981"} 
            />
            <Text style={[
              styles.secondaryActionText,
              (!user.isActivated || user.availableBalance < 1000) && styles.disabledText
            ]}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Header */}
      <View style={styles.activityHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
    </View>
  ), [user, handleActivate, handleRefer, handleWithdraw]);

  return (
    <FlatList
      style={styles.flatList}
      data={recentActivities}
      renderItem={renderActivity}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.contentContainer}
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
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  container: {
    backgroundColor: '#0F1419',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1419',
  },
  loadingCard: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1F2E',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00FFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0F1419',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    color: '#00FFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  levelBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  levelText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  progressCard: {
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#00FFFF',
  },
  progressInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    color: '#00FFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressMembers: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  progressHighlight: {
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  progressRemaining: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  statsSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mainEarningsCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    marginBottom: 12,
  },
  earningsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  earningsAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  earningsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  statsValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenGradient: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  orangeGradient: {
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
  },
  actionsSection: {
    margin: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#00FFFF',
    alignItems: 'center',
  },
  secondaryAction: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  disabledAction: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  actionText: {
    color: '#0F1419',
    fontWeight: 'bold',
    marginTop: 8,
  },
  secondaryActionText: {
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 8,
  },
  disabledText: {
    color: '#6B7280',
  },
  activityHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
});