// Import frameworka Express do tworzenia routera
const express = require('express');
const router = express.Router();

// Import kontrolera obsługującego logikę rezerwacji
const reservationController = require('../controllers/reservationController');

// Import middleware autoryzacyjnego
const { authMiddleware } = require("../middleware/authMiddleware");

// Utworzenie nowej rezerwacji (wymagana autoryzacja)
router.post('/', authMiddleware, reservationController.reserveSeat);

// Pobranie wszystkich rezerwacji zalogowanego użytkownika
router.get('/my', authMiddleware, reservationController.getMyReservations);

// Anulowanie rezerwacji po ID (wymagana autoryzacja)
router.delete('/:reservationId', authMiddleware, reservationController.cancelReservation);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
