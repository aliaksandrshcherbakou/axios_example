import Square from '@Components/Icons';
import {COLORS} from '@Constants/style.constants';
import {ROUTES, TabBarStackParamList} from '@Types/routes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FC} from 'react';
import {StyleSheet} from 'react-native';
import Main from '../Main';
import Profile from '../Profile';
import Statistics from '../Statistics';

const Tab = createBottomTabNavigator<TabBarStackParamList>();

const BottomMenu: FC = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ADADAD',
          tabBarStyle: styles.tabBar,
          headerShown: false,
          tabBarIcon: props => <Square {...props} />,
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name={ROUTES.MAIN}
          component={Main}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name={ROUTES.STATISTICS}
          component={Statistics}
          options={{
            tabBarLabel: 'Stats',
          }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE}
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    backgroundColor: COLORS.HeavyMetal,
    paddingBottom: 10,
    height: 60,
  },
});

export default BottomMenu;
