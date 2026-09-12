import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hearth_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  total_xp: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  last_active_date?: string;
}

export interface WickState {
  id?: string;
  user_id?: string;
  stage: 'Spark' | 'Ember' | 'Flame' | 'Blaze' | 'Hearthkeeper' | string;
  mood: 'tired' | 'quiet' | 'neutral' | 'happy' | 'joyful' | string;
  energy: number;
  bond: number;
}

export interface Attribute {
  id?: string;
  user_id?: string;
  name: string;
  level: number;
  xp: number;
}

export interface TaskItem {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  category?: string;
  attribute_name?: string;
  xp_reward: number;
  coin_reward: number;
  completed: boolean;
  due_date?: string;
  created_at?: string;
}

export interface MemoryItem {
  id: string;
  memory: string;
  importance: number;
  created_at: string;
}

export interface DashboardData {
  profile: UserProfile;
  wick: WickState;
  attributes: Attribute[];
}

export interface CompleteTaskResponse {
  message: string;
  task: TaskItem;
  rewards: {
    xp: number;
    coins: number;
  };
  progression: {
    total_xp: number;
    coins: number;
    current_streak: number;
    longest_streak: number;
  };
  attribute?: Attribute;
  attribute_level_up: boolean;
  wick: WickState;
  stage_transition?: {
    old_stage: string;
    new_stage: string;
  } | null;
  wick_response?: string | null;
}

export const apiService = {
  async login(email: string, password: string) {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  },

  async signup(email: string, password: string) {
    const res = await api.post('/api/auth/signup', { email, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/api/me');
    return res.data;
  },

  async getDashboard(): Promise<DashboardData> {
    const res = await api.get('/api/dashboard');
    return res.data;
  },

  async getTasks(): Promise<{ tasks: TaskItem[] }> {
    const res = await api.get('/api/tasks');
    return res.data;
  },

  async createTask(data: {
    title: string;
    description?: string;
    category?: string;
    attribute_name?: string;
    due_date?: string;
  }): Promise<{ message: string; task: TaskItem }> {
    const res = await api.post('/api/tasks', data);
    return res.data;
  },

  async completeTask(taskId: string): Promise<CompleteTaskResponse> {
    const res = await api.post(`/api/tasks/${taskId}/complete`);
    return res.data;
  },

  async deleteTask(taskId: string): Promise<{ message: string; task_id: string }> {
    const res = await api.delete(`/api/tasks/${taskId}`);
    return res.data;
  },

  async getMemories(): Promise<{ memories: MemoryItem[] }> {
    const res = await api.get('/api/wick/memories');
    return res.data;
  },

  async chatWithWick(message: string): Promise<{ response: string; wick: WickState }> {
    const res = await api.post('/api/wick/chat', { message });
    return res.data;
  },
};
