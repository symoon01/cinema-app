# 🎬 CinemaApp - System Rezerwacji Kinowej

CinemaApp to aplikacja webowa umożliwiająca użytkownikom przeglądanie repertuaru kina oraz interaktywną rezerwację miejsc na seanse. Projekt został zrealizowany w architekturze klient-serwer z wykorzystaniem kontenerów Docker.

---

## 🛠 Technologie

* **Frontend:** `React` (klient)
* **Backend:** `Node.js` + `Express` (API)
* **Baza danych:** `PostgreSQL`
* **Konteneryzacja:** `Docker` + `Docker Compose`

---

## ✨ Funkcjonalności

* 🖥 **Przegląd Repertuaru:** lista filmów i seansów pobierana dynamicznie z bazy danych.
* 🪑 **Interaktywna Sala:** wizualny wybór miejsc z podziałem na rzędy.
* 📝 **Rezerwacja miejsc:** przypisanie miejsca do użytkownika i seansu.
* 👤 **Profil Użytkownika:** Zarządzanie danymi profilowymi, zmiana hasła oraz możliwość usunięcia konta.
* 📝 **Przegląd rezerwacji:** Możliwość sprawdzenia dokonanych rezerwacji oraz ich anulowania.
* 🛠 **Panel administratora:** Zabezpieczony moduł do zarządzania filmami i repertuarem kina.

---

## 🚀 Uruchamianie lokalnie

### Wymagania
* Zainstalowany **Docker** oraz **Docker Compose**.

### Kroki instalacji

1.  **Sklonuj repozytorium**
    ```bash
    git clone https://github.com/symoon01/cinema-app.git
    cd cinema-app
    ```

2.  **Uruchom aplikację za pomocą Docker Compose**
    ```bash
    docker-compose up --build
    ```
    *Komenda ta automatycznie zbuduje obrazy, skonfiguruje bazę danych i uruchomi wszystkie usługi.*

3.  **Dostęp do aplikacji**
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🌐 Wdrożenie Online

Aplikacja jest dostępna pod adresem:

* **Wersja demonstracyjna:** [https://cinema-frontend-three.vercel.app/](https://cinema-frontend-three.vercel.app/)

---
