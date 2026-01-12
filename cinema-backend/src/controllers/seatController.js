const seatModel = require('../models/seatModel');
const screeningModel = require('../models/screeningModel');

/**
 * Pobranie wszystkich miejsc dla danego seansu
 * @param {object} req - obiekt żądania Express (req.params.id = id seansu)
 * @param {object} res - obiekt odpowiedzi Express
 */
async function getSeats(req, res) {
  const screeningId = req.params.id;

  // walidacja ID seansu
  if (!screeningId) 
    return res.status(400).json({ error: 'Brak ID seansu' });
  if (isNaN(Number(screeningId))) 
    return res.status(400).json({ error: 'Nieprawidłowe ID seansu' });

  try {
    // sprawdzenie, czy seans jest aktywny
    const isActive = await screeningModel.check_if_screening_is_active(screeningId);
    if (!isActive) {
      return res.status(400).json({ error: 'Seans nie jest aktywny' });
    }

    // pobranie miejsc z modelu
    const seats = await seatModel.getSeatsByScreening(screeningId);
    res.json(seats);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}

module.exports = { getSeats };
