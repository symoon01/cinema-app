// Import frameworka Express do tworzenia routera
const express = require('express');
const router = express.Router();

// Import kontrolera obsługującego logikę miejsc w sali
const seatController = require('../controllers/seatController');

// Import middleware autoryzacyjnego
const { authMiddleware } = require("../middleware/authMiddleware");

// Pobranie miejsc dla konkretnego seansu
// Endpoint chroniony middlewarem autoryzacyjnym
router.get('/:id', authMiddleware, seatController.getSeats);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
