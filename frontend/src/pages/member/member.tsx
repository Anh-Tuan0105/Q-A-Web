// Trong file member.tsx
export interface Member {
  // Phải có chữ 'export' ở đây
  id: number;
  name: string;
  location: string;
  reputation: number;
  postCount: number;
  tags: string[];
  avatar: string;
  isVip?: boolean;
}
