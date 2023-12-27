export interface Book {
  id: number | null;
  author: string;
  name: string;
  createdAt: Date | null;
  isRead: boolean;
}