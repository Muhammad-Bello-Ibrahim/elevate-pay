import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import screens
import Dashboard from './src/screens/Dashboard';
import Referrals from './src/screens/Referrals';
import WalletScreen from './src/screens/Wallet';
import Notifications from './src/screens/Notifications';
import Profile from './src/screens/Profile';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Referrals') {
                  iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Wallet') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'Notifications') {
                  iconName = focused ? 'notifications' : 'notifications-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else {
                  iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3B82F6',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                paddingBottom: 5,
                paddingTop: 5,
                height: 65,
              },
              headerStyle: {
                backgroundColor: '#3B82F6',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{ title: 'Dashboard' }}
            />
            <Tab.Screen 
              name="Referrals" 
              component={Referrals}
              options={{ title: 'Referrals' }}
            />
            <Tab.Screen 
              name="Wallet" 
              component={WalletScreen}
              options={{ title: 'Wallet' }}
            />
            <Tab.Screen 
              name="Notifications" 
              component={Notifications}
              options={{ title: 'Notifications' }}
            />
            <Tab.Screen 
              name="Profile" 
              component={Profile}
              options={{ title: 'Profile' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
