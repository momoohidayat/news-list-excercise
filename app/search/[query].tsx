import { useLocalSearchParams } from 'expo-router';
import SearchScreen from '../screens/search/SearchScreen';

export default function SearchRoute() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const decodedQuery = decodeURIComponent(query);

  return <SearchScreen searchQuery={decodedQuery} />;
}