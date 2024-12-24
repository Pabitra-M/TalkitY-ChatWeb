export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`



export const CONTACT_ROUTES = "api/contact";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTES}/search`
export const GET_CONTACTS_FOR_DM_ROUTE = `${CONTACT_ROUTES}/get-contacts-for-dm`
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/get-all-contacts`



export const MESSAGE_ROUTES = "api/messages";
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/get-message`
export const UPLODE_FILE_ROUTE = `${MESSAGE_ROUTES}/uplode-file`



export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`