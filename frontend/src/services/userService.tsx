import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data;
    }
  } catch (error: any) {
    return handleError(error);
  }
};

export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(`${API_URL}/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const updateUser = async (updateData: {
  name: string;
  email: string;
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }
    const response = await axios.put(`${API_URL}/update`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const deleteUser = async (data: { password: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.delete(`${API_URL}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });

    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const searchUser = async (query: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.post(
      `${API_URL}/search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const addSharedUser = async (email: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.post(
      `${API_URL}/sharedUsers`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getUserWithSharedUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(`${API_URL}/sharedUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

const handleError = (error: any) => {
  if (error.response && error.response.data && error.response.data.errors) {
    const validationErrors = error.response.data.errors;
    const errorsMessage = validationErrors.map(
      (err: { msg: string }) => err.msg
    );
    return { type: "validation", message: errorsMessage };
  }

  if (error.response && error.response.data && error.response.data.message) {
    return { type: "custom", message: error.response.data.message };
  }
  return { type: "server", message: "予期せぬエラーが発生しました" };
};
