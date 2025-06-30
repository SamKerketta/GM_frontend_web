export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const GYM_NAME = import.meta.env.VITE_GYM_NAME;
export const GYM_EMAIL = import.meta.env.VITE_GYM_EMAIL;
export const GYM_CONTACT = import.meta.env.VITE_GYM_CONTACT;
export const CURRENT_DATE = new Date().toISOString().split('T')[0];
export const CURRENCY = '₹';
export const AUTH_TOKEN = localStorage.getItem("authToken");
export const SHIFTS = [
    {
        "id": 1,
        "shift_name": "Morning"
    },
    {
        "id": 2,
        "shift_name": "Evening"
    },
];

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];