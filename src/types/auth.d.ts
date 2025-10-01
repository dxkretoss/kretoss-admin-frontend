export interface UserType {
    _id: string;
    name: string;
    email: string;
    role: string;
    user_id: string;
    phone_number?: string
    gender?: string
};

export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface LoginFormProps {
    isModal: boolean
}

export interface RegisterFormProps {
    isModal: boolean
}

// Register API Types
export interface RegisterRequestType {
    email: string;
    password: string;
    name: string;
    phone_number: string;
}

export interface RegisterResponseType {
    success: boolean,
    message: string,
}

// Login API Types
export interface LoginRequestType {
    email: string;
    password: string;
    role: string;
}

export interface LoginResponseType {
    success: boolean,
    message: string,
    data?: UserType,
    otp_verified?: boolean,
    token?: string
    cartItems?: Event
}

// OTP Verify API Types
export interface OtpVerifyRequestType {
    email: string;
    otp: string;
}

export interface OtpVerifyResponseType {
    success: boolean,
    message: string,
    data?: UserType,
    access_token?: string
    cartItems?: Event
}

export interface ForgotPasswordRequestType {
    email: string;
}

export interface ForgotPasswordResponseType {
    success: boolean,
    message: string,
}
export interface ResetPasswordRequestType {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponseType {
    success: boolean,
    message: string,
}

export interface ChangePasswordRequestType {
    newPassword: string;
    currentPassword: string;
}

export interface ChangePasswordResponseType {
    success: boolean,
    message: string,
}

export interface UpdateProfileRequestType {
    email: string;
    name: string;
    phone_number: string;
}

export interface UpdateProfileResponseType {
    success: boolean,
    message: string,
}