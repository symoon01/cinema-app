// Import frameworka Express do tworzenia serwera HTTP
const express = require('express');

// Import middleware CORS umożliwiającego obsługę zapytań z innych domen
const cors = require('cors');

// Wczytanie zmiennych środowiskowych z pliku .env
require('dotenv').config();

// Import modułów obsługujących poszczególne grupy tras
const screeningRoutes = require('./routes/screeningRoutes');            // Trasy dla seansów
const seatRoutes = require('./routes/seatRoutes');                      // Trasy dla miejsc w kinie
const authRoutes = require('./routes/authRoutes');                      // Trasy dla logowania i rejestracji
const reservationRoutes = require('./routes/reservationRoutes');        // Trasy dla rezerwacji
const adminMovieRoutes = require('./routes/adminMovieRoutes');          // Trasy administratora dla filmów
const adminScreeningRoutes = require('./routes/adminScreeningRoutes');  // Trasy administratora dla seansów
const userRoutes = require('./routes/userRoutes');                      // Trasy dla funkcji użytkownika

// Utworzenie instancji aplikacji Express
const app = express();

// Włączenie CORS w celu zezwolenia na zapytania z frontendów działających w innych domenach
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Włączenie parsowania JSON w ciele żądań
app.use(express.json());

// Podłączenie tras do odpowiednich endpointów
app.use('/api/screenings', screeningRoutes);     // Obsługa żądań dotyczących seansów
app.use('/api/seats', seatRoutes);               // Obsługa żądań dotyczących miejsc
app.use('/api/auth', authRoutes);                // Obsługa żądań autoryzacji i rejestracji
app.use('/api/reservations', reservationRoutes); // Obsługa żądań rezerwacji
app.use('/api/admin', adminMovieRoutes);         // Obsługa żądań administratora dotyczących filmów
app.use('/api/admin', adminScreeningRoutes);     // Obsługa żądań administratora dotyczących seansów
app.use('/api/user', userRoutes);                // Obsługa żądań użytkownika (profil, historia itp.)

// Określenie portu serwera (domyślnie 5000)
const PORT = process.env.PORT || 5000;

// Uruchomienie serwera i wyświetlenie komunikatu w konsoli
app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));