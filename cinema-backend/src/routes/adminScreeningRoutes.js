// Import frameworka Express do tworzenia routera
const express = require("express");
const router = express.Router();

// Import middleware do autoryzacji i sprawdzania roli użytkownika
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// Import kontrolera obsługującego logikę seansów
const screeningController = require('../controllers/screeningController');

// Pobranie listy wszystkich seansów (tylko dla ADMIN)
router.get('/screenings', authMiddleware, roleMiddleware(["ADMIN"]), screeningController.getScreenings);

// Dodanie nowego seansu (tylko dla ADMIN)
router.post("/screenings", authMiddleware, roleMiddleware(["ADMIN"]), screeningController.createScreening);

// Usunięcie seansu po ID (tylko dla ADMIN)
router.delete("/screenings/:id", authMiddleware, roleMiddleware(["ADMIN"]), screeningController.deleteScreening);

// Edycja seansu po ID (tylko dla ADMIN)
router.put("/screenings/:id", authMiddleware, roleMiddleware(["ADMIN"]), screeningController.editScreening);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
