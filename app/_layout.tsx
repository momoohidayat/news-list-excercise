import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Top Headlines',
          }}
        />
        <Stack.Screen
          name="search/[query]"
          options={{
            title: 'Search',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}

