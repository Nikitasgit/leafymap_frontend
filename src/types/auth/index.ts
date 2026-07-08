export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptedCGU: boolean;
  emailNotifications: boolean;
}

export interface LoginFormData {
  identifier: string;
  password: string;
}
