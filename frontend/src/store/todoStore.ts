import { create } from 'zustand';
import api from '@/lib/api';
import { Todo, TodoCreate, TodoUpdate, TodoListResponse } from '@/types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (data: TodoCreate) => Promise<void>;
  updateTodo: (id: string, data: TodoUpdate) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<TodoListResponse>(`${API_URL}/api/todos`);
      set({ todos: response.data.items, loading: false });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Todos', loading: false });
      console.error('Error fetching todos:', error);
    }
  },

  createTodo: async (data: TodoCreate) => {
    set({ error: null });
    try {
      const response = await api.post<Todo>(`${API_URL}/api/todos`, data);
      set((state) => ({
        todos: [response.data, ...state.todos],
      }));
    } catch (error) {
      set({ error: 'Fehler beim Erstellen des Todos' });
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodo: async (id: string, data: TodoUpdate) => {
    set({ error: null });
    try {
      const response = await api.put<Todo>(`${API_URL}/api/todos/${id}`, data);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? response.data : todo
        ),
      }));
    } catch (error) {
      set({ error: 'Fehler beim Aktualisieren des Todos' });
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    set({ error: null });
    try {
      await api.delete(`${API_URL}/api/todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      set({ error: 'Fehler beim Löschen des Todos' });
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  toggleTodo: async (id: string) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;

    await get().updateTodo(id, { completed: !todo.completed });
  },
}));
