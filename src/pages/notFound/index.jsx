import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div style={{ display: "grid", height: "100vh", placeContent: "center" }}>
      <h1>404</h1>
      <Link to="/">Home</Link>
    </div>
  );
};
