import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = useCallback(() => {
    logout();
    navigate(`/login`);
  }, [logout, navigate]);

  return (
    <div className="welcome">
      <h2>
        <span>Welcome {user?.userName}</span>
      </h2>
      <button className="submit" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};
