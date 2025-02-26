import { Category } from "./Category";

export interface Task {
    id: number;
    user_id: number;
    category_id: number ;
    title: string;
    description: string;
    due_date: string ;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
    category?: Category;
  }