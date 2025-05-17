import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NewsArticle } from '../api/types';

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const theme = useTheme();

  const handlePress = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 200)}
      style={styles.container}
    >
      <Card mode="elevated" onPress={handlePress} style={styles.card}>
        {article.urlToImage && (
          <Card.Cover
            source={{ uri: article.urlToImage }}
            style={styles.image}
          />
        )}
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={styles.title}>
            {article.title}
          </Text>
          {article.source.name && (
            <Text variant="labelSmall" style={styles.source}>
              {article.source.name}
            </Text>
          )}
          {article.description && (
            <Text variant="bodyMedium" style={styles.description}>
              {article.description}
            </Text>
          )}
          <Text variant="labelSmall" style={styles.date}>
            {new Date(article.publishedAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
  },
  content: {
    paddingVertical: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: '500',
  },
  source: {
    marginBottom: 8,
    opacity: 0.7,
  },
  description: {
    marginBottom: 8,
    opacity: 0.8,
  },
  date: {
    opacity: 0.6,
  },
});