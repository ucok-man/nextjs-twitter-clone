export type UserWithCountFollowing = {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  profileImage?: string;
  hashedPassword: string;
  createdAt: string;
  updatedAt: string;
  hasNotification: boolean;
  followingIds: string[];
  followerIds: string[];
  _count: {
    followings: number;
  };
};
