import { Link, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../services/userService";
import { useEffect, useState } from "react";

interface isAuthenticatedProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateUser: React.FC<isAuthenticatedProps> = ({ setIsAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setName(user.name);
        setEmail(user.email);
      } catch {
        setErrors(["ユーザー情報を取得できませんでした。"]);
      }
    };

    fetchUserData();
  }, []);

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const formData = { name, email };
      const response = await updateUser(formData);
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
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
    }

    if (field === "name" && value) {
      setErrors(errors.filter((error) => error !== "名前を入力してください"));
    } else if (field === "email" && value) {
      setErrors(
        errors.filter(
          (error) => error !== "有効なメールアドレスを入力してください"
        )
      );
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 py-6 mb-4 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">ユーザー更新</h1>
          <form onSubmit={handelSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                name
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              {errors.length > 0 && (
                <div className="text-red-500 text-sm mb-4">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                戻る
              </Link>
              <button
                type="submit"
                className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                更新
              </button>
            </div>
            <div className="flex items-center justify-center">
              <Link to="/delete-user" className="text-red-500 mb-4 ">
                アカウント削除
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
