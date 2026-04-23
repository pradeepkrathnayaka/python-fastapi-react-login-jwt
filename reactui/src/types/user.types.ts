export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  full_name?: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
