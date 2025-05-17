import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { fetchTopHeadlines } from '../../api/news';
import { NewsArticle } from '../../api/types';
import NewsCard from '../../components/NewsCard';

import styles from './styles';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Searchbar
        placeholder="Search news..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      <FlashList
        data={articles}
        renderItem={({ item, index }: { item: NewsArticle; index: number }) => (
          <NewsCard article={item} index={index} />
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