import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Root() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
