import { Link, Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { LayoutDashboard, MessageCircle, Settings } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessageCircle color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Settings mr="$4" />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Settings mr="$4" />
            </Link>
          ),
        }}
      />
    </Tabs>
  )
}
