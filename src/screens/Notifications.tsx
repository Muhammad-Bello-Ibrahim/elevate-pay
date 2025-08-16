import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Notifications = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications] = useState([
    {
      id: '1',
      title: 'New Referral!',
      message: 'Sarah Johnson joined your network. You earned ₦2,500!',
      time: '2 minutes ago',
      type: 'referral',
      read: false,
    },
    {
      id: '2',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of ₦5,000 has been successfully processed.',
      time: '1 hour ago',
      type: 'withdrawal',
      read: false,
    },
    {
      id: '3',
      title: 'Level Upgrade!',
      message: 'Congratulations! You have been upgraded to Growth level.',
      time: '3 hours ago',
      type: 'achievement',
      read: true,
    },
    {
      id: '4',
      title: 'Commission Earned',
      message: 'You earned ₦1,200 from Level 2 commissions.',
      time: '1 day ago',
      type: 'earning',
      read: true,
    },
    {
      id: '5',
      title: 'Chain Update',
      message: 'You are now 5 referrals away from completing your chain.',
      time: '2 days ago',
      type: 'chain',
      read: true,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return { name: 'people' as const, color: '#3B82F6' };
      case 'withdrawal':
        return { name: 'wallet' as const, color: '#10B981' };
      case 'achievement':
        return { name: 'trophy' as const, color: '#F59E0B' };
      case 'earning':
        return { name: 'cash' as const, color: '#10B981' };
      case 'chain':
        return { name: 'link' as const, color: '#8B5CF6' };
      default:
        return { name: 'notifications' as const, color: '#6B7280' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity 
                key={notification.id} 
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons 
                    name={iconConfig.name} 
                    size={24} 
                    color={iconConfig.color} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </View>

      {/* Notification Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Notification Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="people" size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Referral Updates</Text>
            </View>
            <View style={styles.settingToggle}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cash" size={20} color="#10B981" />
              <Text style={styles.settingLabel}>Earning Notifications</Text>
            </View>
            <View style={styles.settingToggle}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="wallet" size={20} color="#F59E0B" />
              <Text style={styles.settingLabel}>Withdrawal Updates</Text>
            </View>
            <View style={styles.settingToggle}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trophy" size={20} color="#F59E0B" />
              <Text style={styles.settingLabel}>Achievement Alerts</Text>
            </View>
            <View style={styles.settingToggle}>
              <Ionicons name="ellipse-outline" size={24} color="#D1D5DB" />
            </View>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  markAllButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  markAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
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
  settingsSection: {
    margin: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
  },
  settingToggle: {
    marginLeft: 16,
  },
});

export default Notifications;