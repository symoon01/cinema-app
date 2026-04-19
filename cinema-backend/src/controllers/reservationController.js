const reservationModel = require('../models/reservationModel');
const screeningModel = require('../models/screeningModel');
const seatModel = require('../models/seatModel');
const { getAuth } = require("@clerk/express");

/**
 * Rezerwacja miejsca na seansie
 */
async function reserveSeat(req, res) {
  try {
    
    const { screeningId, seatId } = req.body;
    // Walidacja danych wejściowych
    if (!screeningId || !seatId) {
      return res.status(400).json({ error: "screeningId i seatId są wymagane" });
    }

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    // Sprawdzenie czy seans istnieje i jest aktywny
    const active = await screeningModel.check_if_screening_is_active(screeningId);
    if (!active) return res.status(400).json({ error: "Seans nie istnieje lub już się odbył" });

    // Sprawdzenie czy miejsce istnieje
    const seat = await seatModel.getSeatById(seatId);
    if (!seat) return res.status(400).json({ error: "Miejsce nie istnieje" });

    // Sprawdzenie czy miejsce nie jest już zarezerwowane
    const isReserved = await reservationModel.check_if_seat_is_reserved(screeningId, seatId);
    if (isReserved) return res.status(400).json({ error: "Miejsce jest już zajęte" });

    // Tworzenie rezerwacji
    const reservation = await reservationModel.createReservation(userId, screeningId, seatId);
    res.json(reservation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Pobranie wszystkich rezerwacji zalogowanego użytkownika
 */
async function getMyReservations(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Niepoprawny użytkownik" });

    // Pobranie rezerwacji
    const reservations = await reservationModel.getReservationsByUser(userId);
    res.json(reservations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Anulowanie rezerwacji
 */
async function cancelReservation(req, res) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Niepoprawny użytkownik" });

    const { reservationId } = req.params;
    if (!reservationId) return res.status(400).json({ error: "Brak ID rezerwacji" });
    if (isNaN(Number(reservationId))) return res.status(400).json({ error: "Nieprawidłowe ID rezerwacji" });

    // Sprawdzenie czy rezerwacja należy do użytkownika
    const belongsToUser = await reservationModel.check_if_reservation_belongs_to_user(reservationId, userId);
    if (!belongsToUser) return res.status(403).json({ error: "Rezerwacja nie należy do użytkownika" });

    // Sprawdzenie czy seans jeszcze się nie odbył
    const active = await screeningModel.check_if_reservation_screening_is_active(reservationId);
    if (!active) return res.status(400).json({ error: "Nie można anulować rezerwacji na seans, który się już odbył" });

    // Anulowanie rezerwacji
    await reservationModel.cancelReservation(reservationId, userId);
    res.json({ message: "Rezerwacja anulowana" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

module.exports = { reserveSeat, getMyReservations, cancelReservation };
