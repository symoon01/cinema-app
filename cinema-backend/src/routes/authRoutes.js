// Import frameworka Express do tworzenia routera
const express = require('express');
const router = express.Router();

// Import kontrolera obsługującego logikę autoryzacji
const authController = require('../controllers/authController');

// Rejestracja nowego użytkownika
router.post('/register', authController.register);

// Logowanie użytkownika
router.post('/login', authController.login);

// Odświeżanie tokena JWT
router.post('/refreshtoken', authController.refreshToken);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
