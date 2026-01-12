import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './Login.css';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useContext(AuthContext); // pobranie funkcji logowania z kontekstu
  const [loginInput, setLoginInput] = useState(''); // przechowywanie wartości pola login
  const [password, setPassword] = useState(''); // przechowywanie wartości pola hasło
  const navigate = useNavigate(); // umożliwia nawigację po zalogowaniu

  // obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // zapobieganie domyślnej akcji formularza
    if (!loginInput || !password) {
      toast.error("Podaj login i hasło"); // walidacja pól
      return;
    }

    try {
      // wysłanie danych logowania do backendu
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, password })
      });
      const data = await res.json(); // odczyt odpowiedzi z serwera

      if (res.ok) {
        // zapisanie danych użytkownika i tokena w kontekście
        login({ 
          token: data.token, 
          username: data.login, 
          email: data.email, 
          role: data.role 
        });
        toast.success("Zalogowano pomyślnie"); // komunikat powodzenia
        navigate('/'); // przekierowanie na stronę główną
      } else {
        toast.error(data.error); // wyświetlenie błędu z backendu
      }
    } catch (err) {
      console.error(err);
      toast.error("Błąd sieci, spróbuj ponownie"); // obsługa błędów sieciowych
    }
  };

  return (
    <div className="login-container">
      {/* formularz logowania */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Logowanie</h2>

        {/* pole login */}
        <input
          type="text"
          placeholder="Login"
          value={loginInput}
          onChange={e => setLoginInput(e.target.value)}
          required
        />

        {/* pole hasło */}
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* przycisk logowania */}
        <button type="submit">Zaloguj</button>
      </form>

      {/* sekcja przekierowania do rejestracji */}
      <div className="login-register">
        <span>Nie masz jeszcze konta? </span>
        <Link to="/register">
          <button>Zarejestruj się</button>
        </Link>
      </div>
    </div>
  );
}
