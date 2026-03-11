export interface Member {
  _id: string;
  displayName: string;
  userName: string;
  location?: string;
  reputation: number;
  postCount: number;
  jobTitle?: string;
  avatarUrl?: string;
  topTags?: { _id: string, name: string }[];
}
