import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { postsService } from '@/services/posts';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
import { Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateForumPost'>;

const SUGGESTED_TAGS = [
  'Health',
  'Diet',
  'Care',
  'Behavior',
  'Housing',
  'Question',
  'Advice',
  'Emergency',
  'Success Story',
  'Photo Share',
];

const CreateForumPostScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant camera roll permissions to add photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    try {
      setIsSubmitting(true);

      const newPost = {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        imageUri: imageUri || undefined,
        tags: selectedTags,
      };

      await postsService.createPost(newPost);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
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
        <Text style={styles.headerTitle}>Create Post</Text>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          style={styles.submitButton}
        >
          Post
        </Button>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          placeholder="What's on your mind?"
        />

        <TextInput
          label="Content"
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.contentInput]}
          mode="outlined"
          multiline
          numberOfLines={6}
          placeholder="Share your thoughts, questions, or advice..."
        />

        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagContainer}>
          {SUGGESTED_TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                selectedTags.includes(tag) && styles.selectedTag
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.selectedTagText
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePick}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.selectedImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <MaterialIcons name="add-photo-alternate" size={32} color="#757575" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  submitButton: {
    backgroundColor: '#5D4037',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  contentInput: {
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 8,
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
    backgroundColor: '#EEEEEE',
  },
  selectedTag: {
    backgroundColor: '#5D4037',
  },
  tagText: {
    color: '#5D4037',
    fontSize: 14,
  },
  selectedTagText: {
    color: 'white',
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#757575',
    fontSize: 14,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
});

export default CreateForumPostScreen; 