import { User } from "@prisma/client";

export interface AuthUser extends Omit<User, "password"> {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message: string;
  token?: string;
}

export interface Session {
  user?: AuthUser;
  expires: string;
}
