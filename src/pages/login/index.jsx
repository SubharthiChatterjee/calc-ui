import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { useAuth } from "../../auth/authProvider";
import "./login.style.css";

const Login = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enter } = useAuth();

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (loading) {
        return;
      }
      setLoading(true);
      enter(user, ({ status }) => {
        if (status) {
          navigate(`/`);
        } else {
          NotificationManager.info("Error occurred");
          setLoading(false);
        }
      });
    },
    [user, navigate, loading, enter]
  );

  return (
    <div className="container">
      <h2>Calculator</h2>
      <div className="inputs">
        <form onSubmit={onSubmit}>
          <div className="input">
            <input
              autoComplete="off"
              type="text"
              name="email"
              id="email"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <label>Name</label>
          </div>
          <input
            className="submit"
            type="submit"
            value={loading ? "Loading..." : "Enter"}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
