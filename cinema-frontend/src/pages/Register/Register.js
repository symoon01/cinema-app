import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';
import { toast } from 'react-toastify';

export default function Register() {
  const [login, setLogin] = useState(''); // przechowywanie loginu użytkownika
  const [email, setEmail] = useState(''); // przechowywanie adresu email
  const [password, setPassword] = useState(''); // przechowywanie hasła
  const navigate = useNavigate(); // nawigacja po rejestracji

  // obsługa wysłania formularza rejestracji
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // walidacja pól formularza
    if (!login || login.length < 3) {
      toast.error("Login musi mieć minimum 3 znaki");
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Niepoprawny email");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Hasło musi mieć minimum 6 znaków");
      return;
    }

    try {
      // wysłanie żądania rejestracji do API
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, email, password })
      });

      const data = await res.json();

      // sprawdzenie odpowiedzi serwera
      if (res.ok) {
        toast.success('Konto utworzone! Można teraz zalogować się do systemu.');
        navigate('/login'); // przekierowanie do strony logowania
      } else {
        toast.error(data.error); // wyświetlenie błędu serwera
      }
    } catch (err) {
      console.error(err);
      alert('Błąd sieci, spróbuj ponownie'); // obsługa błędu połączenia
    }
  };

  // renderowanie formularza rejestracji
  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Rejestracja</h2>

        {/* pole loginu */}
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={e => setLogin(e.target.value)}
          required
        />

        {/* pole email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* pole hasła */}
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* przycisk rejestracji */}
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}
