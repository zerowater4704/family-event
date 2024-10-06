import { useState } from "react";
import { deleteUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

interface isAuthenticatedProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteUser: React.FC<isAuthenticatedProps> = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await deleteUser({ password });
      if (!response.type) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
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
      return setErrors(["予期せぬエラーが発生しました。"]);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "password":
        setPassword(value);
        break;
    }

    if (field === "password" && value) {
      setErrors(
        errors.filter((error) => error !== "パスワードが間違っています")
      );
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 py-6 mb-4 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            アカウント削除
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                password:{" "}
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
            <div className="flex items-center justify-center">
              <button type="submit" className="text-red-500 mb-4">
                アカウント削除
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
