import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { postsService } from '@/services/posts';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumPost'>;

const ForumPostScreen = ({ route, navigation }: Props) => {
  const { post, onLike } = route.params;
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to comment');
      return;
    }

    try {
      setIsSubmitting(true);

      const comment = {
        userId: user.id,
        content: newComment.trim(),
      };

      await postsService.addComment(post.id, comment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.postCard}>
          <Card.Content>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postDate}>
              {new Date(post.date).toLocaleDateString()}
            </Text>
            <Text style={styles.postContent}>{post.content}</Text>
            
            {post.imageUri && (
              <Image
                source={{ uri: post.imageUri }}
                style={styles.postImage}
                contentFit="cover"
              />
            )}

            <View style={styles.tagContainer}>
              {post.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.postStats}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => onLike?.(post.id)}
              >
                <MaterialIcons name="favorite" size={24} color="#5D4037" />
                <Text style={styles.statsText}>{post.likes} likes</Text>
              </TouchableOpacity>
              <View style={styles.commentCount}>
                <MaterialIcons name="comment" size={24} color="#5D4037" />
                <Text style={styles.statsText}>
                  {post.comments.length} comments
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.commentsHeader}>Comments</Text>

        {post.comments.map(comment => (
          <Card key={comment.id} style={styles.commentCard}>
            <Card.Content>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <View style={styles.commentFooter}>
                <Text style={styles.commentDate}>
                  {new Date(comment.date).toLocaleDateString()}
                </Text>
                <View style={styles.commentLikes}>
                  <MaterialIcons name="favorite" size={16} color="#5D4037" />
                  <Text style={styles.commentLikesText}>{comment.likes}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Card style={styles.commentInputCard}>
        <Card.Content style={styles.commentInputContent}>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            mode="outlined"
            style={styles.input}
            multiline
          />
          <Button
            mode="contained"
            onPress={handleAddComment}
            loading={isSubmitting}
            disabled={isSubmitting || !newComment.trim()}
            style={styles.submitButton}
          >
            Post
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFF8E1',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 16,
  },
  postContent: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#5D4037',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5D4037',
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D4037',
    marginVertical: 16,
  },
  commentCard: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  commentContent: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  commentLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikesText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#5D4037',
  },
  commentInputCard: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  commentInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#5D4037',
  },
});

export default ForumPostScreen; 