import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { fetchTopHeadlines } from '../api/news';
import { NewsArticle } from '../api/types';
import NewsCard from '../components/NewsCard';

export default function HomeScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['topHeadlines'],
    queryFn: ({ pageParam = 1 }) => fetchTopHeadlines(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.articles.length > 0 ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (isError) {
    return <ActivityIndicator style={styles.loader} color="red" />;
  }

  const articles = data?.pages.flatMap(page => page.articles) ?? [];

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={({ item, index }) => (
          <NewsCard article={item as NewsArticle} index={index} />
        )}
        keyExtractor={(item) => item.url}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
        contentContainerStyle={styles.list}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 16,
  },
});