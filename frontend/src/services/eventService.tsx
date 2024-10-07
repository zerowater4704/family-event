import axios from "axios";

const API_URL = "http://localhost:3000/api/event";

export const createEvent = async (data: {
  title: string;
  date: Date;
  startTime: string;
  finishTime: string;
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.post(`${API_URL}/createEvent`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return {
        type: "error",
        message: "イベント作成に失敗しました",
      };
    }

    return response.data;
  } catch (error: any) {
    return {
      type: "error",
      message: "イベント作成中にエラーが起きました。",
    };
  }
};

export const getEventByUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(`${API_URL}/get-event`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      type: "error",
      message: "イベント取得に失敗しました",
    };
  }
};

export const getSharedUsers = async () => {
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
    return { type: "error", message: "共有するユーザー取得に失敗しました" };
  }
};

export const getSharedEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }

    const response = await axios.get(`${API_URL}/sharedEvents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch {
    return { type: "error", message: "共有するユーザー取得に失敗しました" };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        type: "auth",
        message: "ログインしてください、tokenがありません",
      };
    }
    console.log(`削除リクエスト: eventId = ${eventId}`);
    const response = await axios.delete(`${API_URL}/delete/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("API エラー:", error);
    return { type: "error", message: "イベント作成に失敗しました" };
  }
};
