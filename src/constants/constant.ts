// Constant values (e.g OTP expiry time, token expiry time,OTP Length, etc)
export const MAX_MOBILE_LENGTH = 17;
export const MIN_MOBILE_LENGTH = 9;
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const OTP_COOLDOWN_LIMIT = 60;
export const OTP_LENGTH = 6;

// Validation Regex
export const PHONE_NUMBER_REGEX = new RegExp(
  `^\\+?[1-9]\\d{${MIN_MOBILE_LENGTH - 1},${MAX_MOBILE_LENGTH - 1}}$`
);
export const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/i;
export const MAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Error and Success Messages
export const SIGNUP_SUCCESS_MESSAGE = "Sign-Up Successful";
export const LOGIN_SUCCESS_MESSAGE = "Login Successful";
export const LOGOUT_SUCCESS_MESSAGE = "Logout Successful";
export const DATA_UPDATE_SUCCESS_MESSAGE = "Data Updated Successfully";
export const RECORD_CREATE_SUCCESS_MESSAGE = "Record Created Successfully";
export const RECORD_DELETE_SUCCESS_MESSAGE = "Record Deleted Successfully";
export const DOCUMENT_DELETE_SUCCESS_MESSAGE = "Document Deleted Successfully";
export const PASSWORD_CHANGE_SUCCESS_MESSAGE = "Password Changed Successfully";
export const USER_DELETE_SUCCESS_MESSAGE = "User Deleted Successfully";
export const USER_CREATED_SUCCESS_MESSAGE = "User Created Successfully";
export const USER_UPDATED_SUCCESS_MESSAGE = "User Updated Successfully";
export const USER_DISABLED_SUCCESS_MESSAGE = "User Disabled Successfully";
export const USER_UNAUTHORIZED_MESSAGE =
  "You are not authorized to perform this action";

// Endpoints
export const REGENERATE_ACCESS_TOKEN_ENDPOINT = `/auth/regenerate-access-token`; // Update this to your endpoint
export const BASE_URL = "https://localhost:8000/api/v1"; // Update this to your base URL
export const USER_ME_ENDPOINT = `/auth/me`; // Update this to your endpoint
export const MASTER_DATA_ENDPOINT = `/master-data`; // Update this to your endpoint
export const LOGIN_ENDPOINT = ""; // Update this to your endpoint
export const OTP_ENDPOINT = "/otp"; // Update this to your endpoint
// Routes
export const LOGIN_ROUTE = "/auth";
export const DASHBOARD_ROUTE = "/dashboard";
export const SIGNUP_ROUTE = "/sign-up";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const RESET_PASSWORD_ROUTE = "/reset-password";

// User Roles

// Constant Styles (e.g colors, fonts, BorderRadius, etc)
export const Styles = {
  light: {
    primary: "#0078d4",
    background: "#ffffff",
    borderRadius: "13px",
    textPrimary: "#000000",
    textSecondary: "#000000",
  },
  dark: {
    primary: "#88bb3e",
    background: "#121212",
    borderRadius: "13px",
    textPrimary: "#ffffff",
    textSecondary: "#ffffff",
  },
};
export const typographyStyles = {
  heading: {
    fontWeight: "bold",
    color: "#104930",
  },
};
export const DocumentCategoryColors = ["#2f4033", "#3b755a", "#3c5142", "#779488", "#88bb3e"];

export const leftNavListName = "LeftNavigation";

export const TopNavListName = "TopNav";

export enum TopNavListColumn {
  Title = "Title",
  OpenInNewTab = "OpenInNewTab",
  Icon = "Icon",
  SortOrder = "SortOrder",
  IsVisible = "IsVisible",
}

export const TopNavListColumns = {
  Title: TopNavListColumn.Title,
  OpenInNewTab: TopNavListColumn.OpenInNewTab,
  Icon: TopNavListColumn.Icon,
  SortOrder: TopNavListColumn.SortOrder,
  IsVisible: TopNavListColumn.IsVisible,
}
