export const API_BASE_URL = 'http://13.234.76.248:8001/api';
export const GYM_NAME = 'Gravity Unisex Fitness Club';
export const GYM_EMAIL = 'info@gravityfintness.com';
export const GYM_CONTACT = '+91 0123456789';
export const CURRENT_DATE = new Date().toISOString().split('T')[0];
export const ADMITION_FEE = 200;
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