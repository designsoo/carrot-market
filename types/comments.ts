export type UserInfo = {
  id?: number;
  avatar: string | null;
  username: string;
} | null;

export type Comments = {
  id: number;
  payload: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
  postId: number;
  user: UserInfo;
}[];
