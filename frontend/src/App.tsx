import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SignUp from "./components/user/SignUp";
import LoginUser from "./components/user/Login";
import UpdateUser from "./components/user/UpdateUser";
import DeleteUser from "./components/user/DeleteUser";
import SearchUser from "./components/user/SearchUser";
import UserDetail from "./components/user/UserDetail";
import MyCalendar from "./components/event/MyCalendar";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <>
      <Router>
        <header className="bg-teal-600 text-white shadow-md py-4">
          <div className="container mx-auto flex justify-end items-center">
            <ul className="flex space-x-4">
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link to="/register">会員登録</Link>
                  </li>
                  <li>
                    <Link to="/login">ログイン</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/update-user">ユーザー更新</Link>
                  </li>

                  <li>
                    <Link to="/search-user">ユーザー検索</Link>
                  </li>
                  <li>
                    <Link to="/shared-user">共有ユーザー</Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={() => {
                        setIsAuthenticated(false);
                        localStorage.removeItem("token");
                      }}
                    >
                      ログアウト
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </header>
        <nav className="text-xl bg-teal-600">
          <ul>
            {" "}
            <li>
              <Link to="/shared-user">-</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MyCalendar />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/login"
            element={<LoginUser setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/update-user"
            element={<UpdateUser setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/delete-user"
            element={<DeleteUser setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/search-user"
            element={<SearchUser setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/shared-user"
            element={<UserDetail setAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
