-- backend/db/init.sql

-- ============================================================
-- TABELAS
-- ============================================================

CREATE TABLE IF NOT EXISTS athletes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    birth_year INT NOT NULL CHECK (birth_year > 1800),
    is_retired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_games (
    id SERIAL PRIMARY KEY,
    athlete_id INT NOT NULL,
    game_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (athlete_id)
        REFERENCES athletes(id)
);

-- ============================================================
-- DADOS — 20 atletas
-- ============================================================

INSERT INTO athletes (name, country, sport, birth_year, is_retired) VALUES
('Lionel Messi',       'Argentina',    'Futebol',      1987, FALSE),
('Cristiano Ronaldo',  'Portugal',     'Futebol',      1985, FALSE),
('Neymar',             'Brasil',       'Futebol',      1992, FALSE),
('Marta',              'Brasil',       'Futebol',      1986, FALSE),
('Pelé',               'Brasil',       'Futebol',      1940, TRUE),
('LeBron James',       'Estados Unidos','Basquete',     1984, FALSE),
('Michael Jordan',     'Estados Unidos','Basquete',     1963, TRUE),
('Stephen Curry',      'Estados Unidos','Basquete',     1988, FALSE),
('Kevin Durant',       'Estados Unidos','Basquete',     1988, FALSE),
('Usain Bolt',         'Jamaica',      'Atletismo',    1986, TRUE),
('Michael Phelps',     'Estados Unidos','Natação',      1985, TRUE),
('Simone Biles',       'Estados Unidos','Ginástica',    1997, FALSE),
('Serena Williams',    'Estados Unidos','Tênis',        1981, TRUE),
('Roger Federer',      'Suíça',        'Tênis',        1981, TRUE),
('Rafael Nadal',       'Espanha',      'Tênis',        1986, FALSE),
('Lewis Hamilton',     'Reino Unido',  'Fórmula 1',    1985, FALSE),
('Ayrton Senna',       'Brasil',       'Fórmula 1',    1960, TRUE),
('Tiger Woods',        'Estados Unidos','Golfe',        1975, FALSE),
('Muhammad Ali',       'Estados Unidos','Boxe',         1942, TRUE),
('Kylian Mbappé',      'França',       'Futebol',      1998, FALSE);

-- ============================================================
-- ATLETA DO DIA — altere o athlete_id para testar
-- ============================================================

INSERT INTO daily_games (athlete_id, game_date)
VALUES (1, CURRENT_DATE);