import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import "./Navbar.css";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  const handleLogout = async () => {
    await signOut();
    toast.success("Wylogowano pomyślnie");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>

        {isSignedIn && (
          <>
            <Link to="/myreservations">Moje rezerwacje</Link>
            <Link to="/profile">Profil</Link>

            {isAdmin && (
              <Link to="/admin">Panel Administratora</Link>
            )}
          </>
        )}
      </div>

      <div className="nav-right">
        {isSignedIn ? (
          <>
            <span className="welcome">
              Witaj, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">Zaloguj</button>
            </Link>

            <Link to="/register">
              <button className="register-btn">Zarejestruj</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}