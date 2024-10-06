import { useState, useEffect } from "react";
import { getUserWithSharedUsers } from "../../services/userService";

interface isAuthenticatedProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDetail: React.FC<isAuthenticatedProps> = ({ setAuthenticated }) => {
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchSharedUsers = async () => {
      try {
        const response = await getUserWithSharedUsers();
        if (!response.type) {
          setAuthenticated(true);
          setSharedUsers(response.sharedUsers);
        } else {
          setErrors(response.message);
        }
      } catch {
        setErrors(["共有ユーザーの取得に失敗しました。"]);
      }
    };
    fetchSharedUsers();
  }, []);
  return (
    <>
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-4">共有ユーザー</h2>
        {errors && <p className="text-red-500 mb-4">{errors}</p>}
        {sharedUsers.length > 0 ? (
          <ul className=" pl-5 space-y-4">
            {sharedUsers.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-white shadow-sm p-4 rounded"
              >
                <span>
                  {user.name} - {user.email}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">共有ユーザーがいません</p>
        )}
      </div>
    </>
  );
};

export default UserDetail;
