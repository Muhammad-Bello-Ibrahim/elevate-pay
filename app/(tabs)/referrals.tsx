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
import { useAuth } from '../../contexts/AuthContext';

export default function Referrals() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const [referrals] = useState([
    { id: '1', name: 'Sarah Johnson', level: 'L1', earnings: 2500, joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'Mike Chen', level: 'L1', earnings: 1800, joinDate: '2024-01-20', status: 'active' },
    { id: '3', name: 'Emma Wilson', level: 'L2', earnings: 1200, joinDate: '2024-01-25', status: 'pending' },
    { id: '4', name: 'James Brown', level: 'L1', earnings: 3200, joinDate: '2024-02-01', status: 'active' },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleShareLink = () => {
    Alert.alert('Referral Link Copied!', 'Share your referral link to grow your network');
  };

  const totalEarningsFromReferrals = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
  const activeReferrals = referrals.filter(ref => ref.status === 'active').length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#00FFFF" />
          <Text style={styles.statNumber}>{referrals.length}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statNumber}>{activeReferrals}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>₦{totalEarningsFromReferrals.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
        <Ionicons name="share" size={20} color="#0F1419" />
        <Text style={styles.shareButtonText}>Share Referral Link</Text>
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Chain Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(user?.chainProgress || 0)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {user?.membersReferred || 0} of {user?.totalRequired || 20} members
        </Text>
      </View>

      {/* Referrals List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Referrals</Text>
        {referrals.length > 0 ? (
          referrals.map((referral) => (
            <View key={referral.id} style={styles.referralCard}>
              <View style={styles.referralHeader}>
                <View style={styles.referralAvatar}>
                  <Text style={styles.referralAvatarText}>
                    {referral.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.referralInfo}>
                  <Text style={styles.referralName}>{referral.name}</Text>
                  <Text style={styles.referralDate}>Joined {referral.joinDate}</Text>
                </View>
                <View style={styles.referralStatus}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: referral.status === 'active' ? '#10B981' : '#F59E0B' }
                  ]}>
                    <Text style={styles.statusText}>{referral.status}</Text>
                  </View>
                  <Text style={styles.referralLevel}>{referral.level}</Text>
                </View>
              </View>
              <View style={styles.referralFooter}>
                <View style={styles.earningsInfo}>
                  <Ionicons name="cash" size={16} color="#10B981" />
                  <Text style={styles.earningsText}>₦{referral.earnings.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyStateTitle}>No Referrals Yet</Text>
            <Text style={styles.emptyStateText}>
              Start sharing your referral link to build your network
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  shareButton: {
    backgroundColor: '#00FFFF',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#0F1419',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  referralCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00FFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  referralAvatarText: {
    color: '#0F1419',
    fontSize: 14,
    fontWeight: 'bold',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  referralDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  referralStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  referralLevel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  referralFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});