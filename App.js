import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <GameProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
              <Stack.Screen name="Privacy" component={PrivacyScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </GameProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
