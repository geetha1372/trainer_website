export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  xp: number;
  level: number;
}
