export interface Task {
  id: number;
  title: string;
  done: boolean;
  status: 'to-do' | 'blocked' | 'in-progress' | 'completed';
  description?: string;
  createdAt: string;
}

export interface NewTask {
  title: string;
  done: boolean;
  status: 'to-do' | 'blocked' | 'in-progress' | 'completed';
  description?: string;
  createdAt: string;
}
