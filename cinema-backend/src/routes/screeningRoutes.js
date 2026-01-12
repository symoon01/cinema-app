// Import frameworka Express do tworzenia routera
const express = require('express');
const router = express.Router();

// Import kontrolera obsługującego logikę seansów
const screeningController = require('../controllers/screeningController');

// Import middleware autoryzacyjnego
const { authMiddleware } = require("../middleware/authMiddleware");

// Pobranie wszystkich aktywnych seansów (dostępne publicznie)
router.get('/active', screeningController.getActiveScreenings);

// Pobranie szczegółów konkretnego seansu po ID (wymagana autoryzacja)
router.get('/:id', authMiddleware, screeningController.getScreeningById);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
