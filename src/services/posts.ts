import { ForumPost } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_STORAGE_KEY = '@guinea_pal_posts';

export class PostsService {
  private static instance: PostsService;
  private constructor() {}

  static getInstance(): PostsService {
    if (!PostsService.instance) {
      PostsService.instance = new PostsService();
    }
    return PostsService.instance;
  }

  async createPost(post: Omit<ForumPost, 'id' | 'date'>): Promise<string> {
    try {
      const posts = await this.getPosts();
      const newPost: ForumPost = {
        ...post,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify([newPost, ...posts]));
      return newPost.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getPosts(): Promise<ForumPost[]> {
    try {
      const postsJson = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      return postsJson ? JSON.parse(postsJson) : [];
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  subscribeToNewPosts(onUpdate: (posts: ForumPost[]) => void): () => void {
    // For local storage, we'll just do an initial load
    this.getPosts().then(onUpdate).catch(console.error);
    // Return empty cleanup function since we don't need to unsubscribe
    return () => {};
  }

  async likePost(postId: string): Promise<void> {
    try {
      const posts = await this.getPosts();
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      );
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async addComment(postId: string, comment: Omit<ForumComment, 'id' | 'date'>): Promise<void> {
    try {
      const posts = await this.getPosts();
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now().toString(),
            ...comment,
            date: new Date().toISOString(),
            likes: 0
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const posts = await this.getPosts();
      const updatedPosts = posts.filter(post => post.id !== postId);
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}

export const postsService = PostsService.getInstance(); 