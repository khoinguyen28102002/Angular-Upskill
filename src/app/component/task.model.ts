export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface NewTask {
  title: string;
  done: boolean;
  createdAt: string;
}
