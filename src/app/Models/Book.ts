export interface Book {
  id: number;
  author: string;
  name: string;
  createdAt: Date | null;
  isRead: boolean;
}