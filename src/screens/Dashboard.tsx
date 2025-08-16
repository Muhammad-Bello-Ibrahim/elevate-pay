import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const [recentActivities] = useState([
    { type: 'referral', message: 'New referral: Sarah joined your network', time: '2 min ago' },
    { type: 'earning', message: '₦500 earned from L2 referral', time: '1 hour ago' },
    { type: 'placement', message: 'Auto-placed in Chain #4521', time: '3 hours ago' },
    { type: 'level', message: 'Congratulations! Level upgraded to Growth', time: '1 day ago' }
  ]);

  useEffect(() => {
    if (user) {
      // Welcome notification
      const timer = setTimeout(() => {
        Alert.alert(
          `Welcome back, ${user.name.split(' ')[0]}! 👋`,
          `You're ${user.totalRequired - user.membersReferred} referrals away from completing your chain.`,
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleActivate = () => {
    Alert.alert(
      'Activate Account',
      'Would you like to activate your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Activate', onPress: () => Alert.alert('Success', 'Account activated!') }
      ]
    );
  };

  const handleWithdraw = () => {
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
  };

  const handleRefer = () => {
    Alert.alert('Referral Link Copied! 📋', 'Share with friends to grow your network');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello, {user.name.split(' ')[0]}!</Text>
            <Text style={styles.subGreeting}>Ready to elevate? 🚀</Text>
          </View>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{user.level} Level</Text>
        </View>
      </View>

      {/* Chain Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Chain Progress</Text>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>{user.chainProgress}%</Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
        <Text style={styles.progressInfo}>
          <Text style={styles.progressBold}>{user.membersReferred}/{user.totalRequired}</Text> members in your chain
        </Text>
        <Text style={styles.progressSubInfo}>
          {user.totalRequired - user.membersReferred} more referrals to complete cycle
        </Text>
      </View>

      {/* Earnings Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        
        <View style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <Ionicons name="trending-up" size={24} color="#3B82F6" />
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsTitle}>Total Earnings</Text>
              <Text style={styles.earningsAmount}>₦{user.totalEarnings.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.earningsGrid}>
          <View style={styles.smallEarningsCard}>
            <Ionicons name="wallet" size={20} color="#10B981" />
            <Text style={styles.smallEarningsTitle}>Available</Text>
            <Text style={styles.smallEarningsAmount}>₦{user.availableBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.smallEarningsCard}>
            <Ionicons name="time" size={20} color="#F59E0B" />
            <Text style={styles.smallEarningsTitle}>Pending</Text>
            <Text style={styles.smallEarningsAmount}>₦{user.pendingWithdrawals.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {!user.isActivated ? (
            <TouchableOpacity style={styles.primaryActionButton} onPress={handleActivate}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.actionButtonText}>Activate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryActionButton} onPress={handleRefer}>
              <Ionicons name="share" size={20} color="white" />
              <Text style={styles.actionButtonText}>Refer</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.secondaryActionButton,
              (!user.isActivated || user.availableBalance < 1000) && styles.disabledButton
            ]} 
            onPress={handleWithdraw}
            disabled={!user.isActivated || user.availableBalance < 1000}
          >
            <Ionicons name="arrow-down-circle" size={20} color="#10B981" />
            <Text style={styles.secondaryActionButtonText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleRefer}>
            <Ionicons name="share" size={20} color="#F59E0B" />
            <Text style={styles.secondaryActionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[
                styles.activityDot,
                { backgroundColor: 
                  activity.type === 'referral' ? '#3B82F6' :
                  activity.type === 'earning' ? '#10B981' :
                  activity.type === 'placement' ? '#F59E0B' :
                  '#8B5CF6'
                }
              ]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  levelBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 8,
    borderColor: '#3B82F6',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBold: {
    fontWeight: 'bold',
    color: '#111827',
  },
  progressSubInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  earningsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsInfo: {
    marginLeft: 12,
    flex: 1,
  },
  earningsTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallEarningsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  smallEarningsTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  smallEarningsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  primaryActionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  secondaryActionButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  secondaryActionButtonText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default Dashboard;