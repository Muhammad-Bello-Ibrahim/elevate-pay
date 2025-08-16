import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const WalletScreen = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const [transactions] = useState([
    { id: '1', type: 'credit', amount: 2500, description: 'Referral bonus from Sarah', date: '2024-02-15', status: 'completed' },
    { id: '2', type: 'debit', amount: 5000, description: 'Withdrawal to bank account', date: '2024-02-10', status: 'completed' },
    { id: '3', type: 'credit', amount: 1800, description: 'Level 2 commission', date: '2024-02-08', status: 'completed' },
    { id: '4', type: 'credit', amount: 3200, description: 'Referral bonus from Mike', date: '2024-02-05', status: 'pending' },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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

  const handleTopUp = () => {
    Alert.alert('Top Up Wallet', 'Feature coming soon!');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={styles.mainBalanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₦{((user?.availableBalance || 0) + (user?.pendingWithdrawals || 0)).toLocaleString()}</Text>
          <View style={styles.balanceBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Available</Text>
              <Text style={styles.breakdownAmount}>₦{(user?.availableBalance || 0).toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Pending</Text>
              <Text style={styles.breakdownAmount}>₦{(user?.pendingWithdrawals || 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>₦{(user?.totalEarnings || 0).toLocaleString()}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            (!user?.isActivated || (user?.availableBalance || 0) < 1000) && styles.disabledButton
          ]} 
          onPress={handleWithdraw}
          disabled={!user?.isActivated || (user?.availableBalance || 0) < 1000}
        >
          <Ionicons name="arrow-down-circle" size={24} color="white" />
          <Text style={styles.actionButtonText}>Withdraw</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryActionButton} onPress={handleTopUp}>
          <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
          <Text style={styles.secondaryActionButtonText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={20} color="#3B82F6" />
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>₦12,500</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.statLabel}>Best Month</Text>
          <Text style={styles.statValue}>₦18,200</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#10B981" />
          <Text style={styles.statLabel}>Active Refs</Text>
          <Text style={styles.statValue}>{user?.membersReferred || 0}</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={transaction.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'} 
                  size={24} 
                  color={transaction.type === 'credit' ? '#10B981' : '#EF4444'} 
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: transaction.type === 'credit' ? '#10B981' : '#EF4444' }
                ]}>
                  {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: transaction.status === 'completed' ? '#10B981' : '#F59E0B' }
                ]}>
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyStateText}>
              Your transaction history will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Withdrawal Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Withdrawal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Minimum Withdrawal:</Text>
            <Text style={styles.infoValue}>₦1,000</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Processing Time:</Text>
            <Text style={styles.infoValue}>1-3 business days</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Withdrawal Fee:</Text>
            <Text style={styles.infoValue}>₦50</Text>
          </View>
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
  balanceContainer: {
    padding: 16,
  },
  mainBalanceCard: {
    backgroundColor: '#3B82F6',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flex: 1,
  },
  breakdownLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  breakdownAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  earningsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#10B981',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryActionButton: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActionButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
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
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoSection: {
    margin: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});

export default WalletScreen;