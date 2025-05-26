import StyledButton from '@/components/StyledButton';
import { useAuth } from '@/contexts/AuthContext';
import { ForumPost, RootStackParamList } from '@/navigation/types';
import { postsService } from '@/services/posts';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsOfTheWheek'>;

const NewsOfTheWheekScreen = ({ navigation }: Props) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFocused) {
      setIsLoading(true);
      unsubscribe = postsService.subscribeToNewPosts((updatedPosts) => {
        setPosts(updatedPosts);
        setIsLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedPosts = await postsService.getPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      Alert.alert('Error', 'Failed to refresh posts. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await postsService.likePost(postId);
    } catch (error) {
      console.error('Failed to like post:', error);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await postsService.deletePost(postId);
            } catch (error) {
              console.error('Failed to delete post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderPost = ({ item }: { item: ForumPost }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ForumPost', { post: item, onLike: handleLikePost })}
    >
      <Card style={styles.postCard}>
        <Card.Content>
          <View style={styles.postHeader}>
            <Text style={styles.postTitle}>{item.title}</Text>
            {item.userId === user?.id && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeletePost(item.id);
                }}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={24} color={colors.buttons.red} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.postContent} numberOfLines={3}>
            {item.content}
          </Text>
          {item.imageUri && (
            <Image
              source={{ uri: item.imageUri }}
              style={styles.postImage}
              contentFit="cover"
            />
          )}
          <View style={styles.postFooter}>
            <Text style={styles.postDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <View style={styles.postStats}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLikePost(item.id);
                }}
              >
                <MaterialIcons name="favorite" size={16} color={colors.text.primary} />
                <Text style={styles.statsText}>{item.likes}</Text>
              </TouchableOpacity>
              <View style={styles.commentCount}>
                <MaterialIcons name="comment" size={16} color={colors.text.primary} />
                <Text style={styles.statsText}>{item.comments.length}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text.primary} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.orange + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.orange} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.orange }]}>News of the Wheek</Text>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.buttons.orange]}
            tintColor={colors.buttons.orange}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="forum" size={48} color={colors.buttons.orange + '60'} />
            <Text style={[styles.emptyText, { color: colors.buttons.orange }]}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to start a discussion!
            </Text>
          </View>
        }
      />

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Create Post"
          icon="add"
          color={colors.buttons.blue}
          onPress={() => navigation.navigate('CreateForumPost')}
          style={styles.createButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
    backgroundColor: colors.buttons.orange + '10',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.buttons.orange,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  postContent: {
    fontSize: 14,
    color: colors.buttons.orange + '99',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: colors.buttons.orange + '80',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 14,
    color: colors.buttons.orange,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  createButton: {
    width: '100%',
  },
});

export default NewsOfTheWheekScreen; 