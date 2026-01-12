// Import frameworka Express do tworzenia routera
const express = require("express");
const router = express.Router();

// Import middleware do autoryzacji i sprawdzania roli użytkownika
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// Import kontrolera obsługującego logikę filmów
const movieController = require("../controllers/movieController");

// Pobranie listy wszystkich filmów (tylko dla ADMIN)
router.get("/movies", authMiddleware, roleMiddleware(["ADMIN"]), movieController.getMovies);

// Dodanie nowego filmu (tylko dla ADMIN)
router.post("/movies", authMiddleware, roleMiddleware(["ADMIN"]), movieController.addMovie);

// Usunięcie filmu po ID (tylko dla ADMIN)
router.delete("/movies/:id", authMiddleware, roleMiddleware(["ADMIN"]), movieController.deleteMovie);

// Edycja filmu po ID (tylko dla ADMIN)
router.put("/movies/:id", authMiddleware, roleMiddleware(["ADMIN"]), movieController.editMovie);

// Eksport routera do podłączenia w aplikacji głównej
module.exports = router;
