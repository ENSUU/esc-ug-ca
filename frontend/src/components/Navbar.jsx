import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

const Navbar = () => {
  const { token, logout } = useContext(TokenContext);

  return (
    <div className="w-screen shadow-sm flex flex-col justify-center items-center gap-2 py-2">
      <Link to="/" className="text-2xl font-bold text-center">
        ESC Undergraduate Project Assistant Coding Assessment
      </Link>
      {token != null && (
        <div className="flex gap-4 py-2">
          <Link className="hover:font-bold" to="/transcript-history">
            Transcript History
          </Link>
          <Link className="hover:font-bold" to="/login" onClick={logout}>
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
