
-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOVIES
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    description TEXT,
    category VARCHAR(50)
);


-- SCREENINGS
CREATE TABLE screenings (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    screening_time TIMESTAMP NOT NULL,
    hall_number INT NOT NULL
);

-- SEATS
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    hall_number INT NOT NULL,
    row_number INT NOT NULL,
    seat_number INT NOT NULL
);

-- RESERVATIONS
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    screening_id INT REFERENCES screenings(id) ON DELETE CASCADE,
    seat_id INT REFERENCES seats(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (screening_id, seat_id)
);

-- Insert default admin and user
insert into users (login, email, password_hash, role, is_active, created_at) values
('admin', 'admin@admin', '$2b$10$Opu08HCir5YqMvmtMM7FluG5MyZFl.lWcpAMplS6pE0qgoVijOp7i', 'ADMIN', true, '2026-01-11 16:36:01.880118'),
('user', 'user@user', '$2b$10$qxN.ja8FC/VoKLCklx/1IeNOJ0DSzQMHrfLaw1at1wFkrZIfgPvc6', 'USER', true, '2026-01-11 16:36:01.880118');

-- Sala 1
INSERT INTO seats (hall_number, row_number, seat_number)
SELECT 1, r, s
FROM generate_series(1,10) r,
     generate_series(1,12) s;

-- Sala 2
INSERT INTO seats (hall_number, row_number, seat_number)
SELECT 2, r, s
FROM generate_series(1,8) r,
     generate_series(1,10) s;