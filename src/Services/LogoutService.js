import axios from "axios";
import { API_BASE_URL } from "../config/utilities";

const LogoutService = {
    logout: async (token) => {
    return axios.post(`${API_BASE_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}

export default LogoutService;