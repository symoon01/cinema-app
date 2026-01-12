// Import frameworka Express do tworzenia routera
const express = require('express');
const router = express.Router();

// Import middleware autoryzacyjnego do ochrony tras
const { authMiddleware } = require('../middleware/authMiddleware');

// Import kontrolera obsługującego logikę użytkownika
const userController = require('../controllers/userController');

// Pobranie profilu zalogowanego użytkownika
// Endpoint chroniony middlewarem autoryzacyjnym
router.get('/me', authMiddleware, userController.getProfile);

// Zmiana hasła zalogowanego użytkownika
// Endpoint chroniony middlewarem autoryzacyjnym
router.put('/password', authMiddleware, userController.changePassword);

// Dezaktywacja konta użytkownika
// Endpoint chroniony middlewarem autoryzacyjnym
router.delete('/', authMiddleware, userController.deactivateAccount);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
