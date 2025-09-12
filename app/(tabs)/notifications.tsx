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

export default function Notifications() {
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
        return { name: 'people' as const, color: '#00FFFF' };
      case 'withdrawal':
        return { name: 'wallet' as const, color: '#10B981' };
      case 'achievement':
        return { name: 'trophy' as const, color: '#F59E0B' };
      case 'earning':
        return { name: 'cash' as const, color: '#10B981' };
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
        <Text style={styles.headerTitle}>Notifications</Text>
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
            <Ionicons name="notifications-off-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! Check back later for updates.
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
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#00FFFF',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'white',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFFF',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
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