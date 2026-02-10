import { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { palette } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ShipmentsScreen } from '../screens/shipments/ShipmentsScreen';
import { SendAddressDetailsScreen } from '../screens/send/SendAddressDetailsScreen';
import { SendBasicScreen } from '../screens/send/SendBasicScreen';
import { SendCartScreen } from '../screens/send/SendCartScreen';
import { SendMethodsScreen } from '../screens/send/SendMethodsScreen';
import { SendPaymentScreen } from '../screens/send/SendPaymentScreen';
import { SendShipmentDetailsScreen } from '../screens/send/SendShipmentDetailsScreen';
import { SendThankYouScreen } from '../screens/send/SendThankYouScreen';
import { TrackScreen } from '../screens/track/TrackScreen';
import type { AuthStackParamList, RootTabParamList, SendStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const SendStack = createNativeStackNavigator<SendStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

function SendNavigator() {
  return (
    <SendStack.Navigator>
      <SendStack.Screen name="SendBasic" component={SendBasicScreen} options={{ title: 'Send' }} />
      <SendStack.Screen name="SendAddressDetails" component={SendAddressDetailsScreen} options={{ title: 'Address details' }} />
      <SendStack.Screen name="SendShipmentDetails" component={SendShipmentDetailsScreen} options={{ title: 'Shipment details' }} />
      <SendStack.Screen name="SendMethods" component={SendMethodsScreen} options={{ title: 'Methods' }} />
      <SendStack.Screen name="SendCart" component={SendCartScreen} options={{ title: 'Cart & checkout' }} />
      <SendStack.Screen name="SendPayment" component={SendPaymentScreen} options={{ title: 'Payment' }} />
      <SendStack.Screen name="SendThankYou" component={SendThankYouScreen} options={{ title: 'Thank You' }} />
    </SendStack.Navigator>
  );
}

function MainTabs() {
  const SendTabButton = (props: BottomTabBarButtonProps) => {
    return (
      <Pressable
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        accessibilityState={props.accessibilityState}
        accessibilityLabel={props.accessibilityLabel}
        testID={props.testID}
        style={{ top: -18, alignItems: 'center' }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: palette.blue,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0A66FF',
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Ionicons name="paper-plane" size={28} color="#fff" />
        </View>
      </Pressable>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.blue,
        tabBarInactiveTintColor: '#667085',
        tabBarStyle: { height: 64 },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Shipments: focused ? 'cube' : 'cube-outline',
            Send: 'paper-plane',
            Track: focused ? 'locate' : 'locate-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };

          if (route.name === 'Send') {
            return null;
          }

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shipments" component={ShipmentsScreen} />
      <Tab.Screen
        name="Send"
        component={SendNavigator}
        options={{
          tabBarLabel: 'Send',
          tabBarButton: SendTabButton,
        }}
      />
      <Tab.Screen name="Track" component={TrackScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const user = useAppStore((state) => state.user);
  const hydrateApp = useAppStore((state) => state.hydrateApp);

  useEffect(() => {
    if (user) {
      void hydrateApp();
    }
  }, [hydrateApp, user]);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.background,
        },
      }}
    >
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
