import { loginUser } from "../../services/userService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface isAuthenticatedProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginUser: React.FC<isAuthenticatedProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const formData = { email, password };
      const response = await loginUser(formData);
      if (!response.type) {
        setIsAuthenticated(true);
        navigate("/");
      } else {
        if (response.type === "validation") {
          setErrors(response.message);
        } else if (response.type === "custom") {
          setErrors([response.message]);
        } else if (response.type === "server") {
          setErrors([response.message]);
        }
      }
    } catch {
      setErrors(["予期せぬエラーが発生しました。"]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
    }

    if (field === "email" && value) {
      setErrors(
        errors.filter(
          (error) => error !== "有効なメールアドレスを入力してください"
        )
      );
    } else if (field === "password" && value) {
      setErrors(
        errors.filter((error) => error !== "パスワードが間違っています")
      );
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 py-6 mb-4 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                email{" "}
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                password{" "}
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            {errors.length > 0 && (
              <div className="text-red-500 text-sm mb-4">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                戻る
              </Link>
              <button
                type="submit"
                className="  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setIsAuthenticated(false);
                  localStorage.removeItem("token");
                }}
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginUser;
