import { RootStackParamList } from '@/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DefaultPetImage = require('../../assets/images/default-pet.png');
const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = width / numColumns;

type Props = NativeStackScreenProps<RootStackParamList, 'GuineaGram'>;

interface GuineaGramPost {
  id: string;
  image: string;
  caption: string;
  date: string;
  likes: number;
  petId?: string;
}

const GuineaGramScreen = ({ route, navigation }: Props) => {
  const [posts, setPosts] = useState<GuineaGramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GuineaGramPost | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      loadPosts();
    }
  }, [isFocused]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const savedPosts = await AsyncStorage.getItem('guineagram_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const navigateToCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take photos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0]?.uri) {
      const newPost: GuineaGramPost = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        caption: '',
        date: new Date().toLocaleDateString(),
        likes: 0
      };

      try {
        const savedPosts = await AsyncStorage.getItem('guineagram_posts');
        const posts = savedPosts ? JSON.parse(savedPosts) : [];
        const updatedPosts = [newPost, ...posts];
        await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
        await loadPosts();
      } catch (err) {
        console.error('Failed to save post:', err);
        Alert.alert('Error', 'Failed to save post. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to choose photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0]?.uri) {
      const newPost: GuineaGramPost = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        caption: '',
        date: new Date().toLocaleDateString(),
        likes: 0
      };

      try {
        const savedPosts = await AsyncStorage.getItem('guineagram_posts');
        const posts = savedPosts ? JSON.parse(savedPosts) : [];
        const updatedPosts = [newPost, ...posts];
        await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
        await loadPosts();
      } catch (err) {
        console.error('Failed to save post:', err);
        Alert.alert('Error', 'Failed to save post. Please try again.');
      }
    }
  };

  const likePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);
      await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
    } catch (err) {
      console.error('Failed to like post:', err);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const deletePost = async (postId: string) => {
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
              const updatedPosts = posts.filter(post => post.id !== postId);
              await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
              setPosts(updatedPosts);
              setSelectedPost(null);
            } catch (err) {
              console.error('Failed to delete post:', err);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderGridItem = ({ item }: { item: GuineaGramPost }) => (
    <TouchableOpacity
      onPress={() => setSelectedPost(item)}
      style={styles.gridItem}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.gridImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderExpandedPost = () => {
    if (!selectedPost) return null;

    return (
      <Modal
        visible={!!selectedPost}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalDate}>{selectedPost.date}</Text>
              <TouchableOpacity
                onPress={() => deletePost(selectedPost.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={24} color="#D32F2F" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedPost(null)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#5D4037" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: selectedPost.image }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => likePost(selectedPost.id)}
              >
                <MaterialIcons name="favorite" size={24} color="#5D4037" />
                <Text style={styles.actionButtonText}>{selectedPost.likes} likes</Text>
              </TouchableOpacity>
            </View>
            {selectedPost.caption ? (
              <Text style={styles.modalCaption}>{selectedPost.caption}</Text>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color="#5D4037" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadPosts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Provider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
          </TouchableOpacity>
          <Text style={styles.header}>GuineaGram</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5D4037']}
              tintColor="#5D4037"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="photo-library" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first post</Text>
            </View>
          }
          contentContainerStyle={[
            posts.length === 0 ? styles.emptyListContent : styles.listContent
          ]}
        />

        {renderExpandedPost()}

        <Portal>
          <FAB.Group
            visible={true}
            open={fabOpen}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              {
                icon: 'camera',
                label: 'Take Photo',
                onPress: navigateToCamera,
                labelStyle: styles.fabLabel,
                style: styles.fabAction
              },
              {
                icon: 'image',
                label: 'Choose from Gallery',
                onPress: pickImage,
                labelStyle: styles.fabLabel,
                style: styles.fabAction
              }
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            fabStyle={styles.fab}
            color="white"
          />
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    padding: 1
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  modalDate: {
    flex: 1,
    color: '#757575',
    fontSize: 14
  },
  closeButton: {
    padding: 4
  },
  deleteButton: {
    padding: 4,
    marginRight: 8
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FAFAFA'
  },
  modalFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalCaption: {
    padding: 16,
    paddingTop: 0,
    color: '#212121',
    fontSize: 16,
    lineHeight: 22
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#5D4037',
    fontWeight: '500'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#5D4037',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#795548',
    textAlign: 'center'
  },
  fab: {
    backgroundColor: '#5D4037'
  },
  fabAction: {
    backgroundColor: '#795548'
  },
  fabLabel: {
    color: '#5D4037',
    fontSize: 14
  },
  listContent: {
    paddingBottom: 80
  },
  emptyListContent: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24
  },
  retryButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default GuineaGramScreen;