import { RootStackParamList } from '@/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingCaption, setEditingCaption] = useState('');
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      loadPosts();
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to save photos.'
        );
      }
    })();
  }, []);

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

  const handleNewPhoto = async (uri: string) => {
    try {
      // First, save the photo to the device's gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Create the GuineaPal album if it doesn't exist
      const albums = await MediaLibrary.getAlbumsAsync();
      let guineaPalAlbum = albums.find(album => album.title === 'GuineaPal');
      
      if (!guineaPalAlbum) {
        guineaPalAlbum = await MediaLibrary.createAlbumAsync('GuineaPal', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], guineaPalAlbum.id, false);
      }

      Alert.prompt(
        'Add Caption',
        'Write a description for your photo',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'Save',
            onPress: async (caption = '') => {
              const newPost: GuineaGramPost = {
                id: Date.now().toString(),
                image: uri,
                caption: caption.trim(),
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
          }
        ],
        'plain-text'
      );
    } catch (error) {
      console.error('Failed to save photo to gallery:', error);
      Alert.alert('Error', 'Failed to save photo to gallery. Please check your permissions and try again.');
    }
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
      handleNewPhoto(result.assets[0].uri);
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
      handleNewPhoto(result.assets[0].uri);
    }
  };

  const updateCaption = async (postId: string, newCaption: string) => {
    try {
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, caption: newCaption.trim() } : post
      );
      setPosts(updatedPosts);
      setSelectedPost({ ...selectedPost!, caption: newCaption.trim() });
      await AsyncStorage.setItem('guineagram_posts', JSON.stringify(updatedPosts));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update caption:', err);
      Alert.alert('Error', 'Failed to update caption. Please try again.');
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
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
                onPress={() => {
                  if (isEditing) {
                    updateCaption(selectedPost.id, editingCaption);
                  } else {
                    setEditingCaption(selectedPost.caption);
                    setIsEditing(true);
                  }
                }}
                style={styles.editButton}
              >
                <MaterialIcons 
                  name={isEditing ? "check" : "edit"} 
                  size={24} 
                  color="#5D4037" 
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isEditing) {
                    setIsEditing(false);
                    setEditingCaption('');
                  } else {
                    setSelectedPost(null);
                  }
                }}
                style={styles.closeButton}
              >
                <MaterialIcons 
                  name={isEditing ? "close" : "close"} 
                  size={24} 
                  color="#5D4037" 
                />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: selectedPost.image }}
              style={[
                styles.modalImage,
                isEditing && { height: '40%' }
              ]}
              resizeMode="contain"
            />
            {isEditing ? (
              <TextInput
                style={styles.captionInput}
                value={editingCaption}
                onChangeText={setEditingCaption}
                placeholder="Write a caption..."
                multiline
                maxLength={500}
                autoFocus
              />
            ) : selectedPost.caption ? (
              <Text style={styles.modalCaption}>{selectedPost.caption}</Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    overflow: 'hidden',
    maxHeight: '90%'
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
  editButton: {
    padding: 4,
    marginRight: 8
  },
  modalImage: {
    width: '100%',
    height: '75%',
    backgroundColor: '#FAFAFA'
  },
  modalCaption: {
    padding: 12,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#212121',
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: 'white',
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
  },
  captionInput: {
    padding: 12,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#212121',
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
    minHeight: 60,
    maxHeight: '25%',
  }
});

export default GuineaGramScreen;