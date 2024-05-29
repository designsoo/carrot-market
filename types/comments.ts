export type UserInfo = {
  id: number;
  username: string;
  avatar: string | null;
};

export type Comment = {
  id: number;
  payload: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
  postId: number;
  user: UserInfo;
};

export type Comments = Comment[];
