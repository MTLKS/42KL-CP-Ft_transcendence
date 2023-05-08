export interface UserData {
  intraId: number;
  userName: string;
  intraName: string;
  elo: number;
  accessToken: string;
  avatar: string;
  tfaSecret: string | null;
}