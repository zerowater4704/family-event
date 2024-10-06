import { addSharedUser, searchUser } from "../../services/userService";
import { useState } from "react";

interface isAuthenticatedProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchUser: React.FC<isAuthenticatedProps> = ({ setIsAuthenticated }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await searchUser(query);
      if (!response.type) {
        setIsAuthenticated(true);
        setResults(response);
      } else {
        setErrors([response.message]);
      }
    } catch {
      setErrors(["ユーザーの検索に失敗しました。"]);
    }
  };

  const handleAddSharedUser = async (email: string) => {
    setErrors([]);
    try {
      const response = await addSharedUser(email);
      if (!response.type) {
        setSuccessMessage("ユーザーを追加しまし");
      } else {
        setErrors([response.message]);
      }
    } catch {
      setErrors(["ユーザーの検索に失敗しました。"]);
    }
  };
  return (
    <>
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-4">ユーザー検索</h2>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={query}
            placeholder="名前やEmailを入力してください"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="font-bold hover:text-gray-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              検索
            </button>
          </div>
        </form>

        {errors.length > 0 && (
          <div className="text-red-500 mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        {successMessage && (
          <div className="text-green-500 mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        <div>
          {results.length > 0 ? (
            <ul className="pl-5 space-y-4">
              {results.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center bg-white shadow-sm p-4 rounded"
                >
                  <span>
                    {user.name} - {user.email}
                  </span>
                  <button
                    onClick={() => handleAddSharedUser(user.email)}
                    className=" font-bold py-2 px-4 rounded hover:text-gray-700"
                  >
                    追加
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">ユーザーが見つかりません</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchUser;
