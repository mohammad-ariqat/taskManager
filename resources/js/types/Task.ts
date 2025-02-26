import { Category } from "./Category";

export interface Task {
    id: number;
    user_id: number;
    category_id: number | null;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
    category?: Category;
  }