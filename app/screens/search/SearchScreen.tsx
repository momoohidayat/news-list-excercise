import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { searchNews } from '../../api/news';
import { NewsArticle } from '../../api/types';
import NewsCard from '../../components/NewsCard';

import styles from './styles';

interface SearchScreenProps {
  searchQuery: string;
}

export default function SearchScreen({ searchQuery }: SearchScreenProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['search', searchQuery],
    queryFn: ({ pageParam = 1 }) => searchNews(searchQuery, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.articles.length > 0 ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: searchQuery.length > 0,
  });

  const loadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const articles = data?.pages.flatMap((page) => page.articles) ?? [];

  if (articles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No results found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={articles}
        renderItem={({ item, index }: { item: NewsArticle; index: number }) => (
          <NewsCard article={item} index={index} />
        )}
        keyExtractor={(item) => item.url}
        estimatedItemSize={200}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.loadingIndicator} />
          ) : null
        }
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </View>
  );
}