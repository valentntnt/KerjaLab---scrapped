-- ============================================
-- KerjaLab Database Initialization
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL,        -- 'hard' atau 'soft'
    difficulty VARCHAR(20) NOT NULL,      -- 'easy' | 'medium' | 'hard'
    description TEXT NOT NULL,
    reward_xp INTEGER NOT NULL,
    reward_coins INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    simulation_id INTEGER NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    score INTEGER NOT NULL,
    xp_gained INTEGER NOT NULL,
    coins_gained INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_sim  ON submissions(simulation_id);

-- ============ SEED DATA ============

INSERT INTO users (username, email) VALUES
    ('valent', 'valent@kerjalab.dev'),
    ('demo',   'demo@kerjalab.dev')
ON CONFLICT (email) DO NOTHING;

INSERT INTO simulations (title, category, difficulty, description, reward_xp, reward_coins) VALUES
    ('Debugging Kode Sederhana', 'hard', 'easy',
     'Diberikan potongan kode JavaScript yang memiliki bug, temukan dan perbaiki kesalahannya. Jawab dengan menyebutkan baris dan perbaikan.',
     50, 10),
    ('Menjelaskan Konsep ke Rekan', 'soft', 'easy',
     'Jelaskan konsep "REST API" kepada rekan non-teknis dalam maksimal 3 kalimat.',
     40, 8),
    ('Optimasi Query SQL', 'hard', 'medium',
     'Diberikan query SQL yang lambat, tuliskan versi optimasi dan jelaskan indeks apa yang perlu ditambahkan.',
     80, 20),
    ('Mengelola Konflik Tim', 'soft', 'medium',
     'Dua rekan tim berdebat soal prioritas fitur. Tuliskan langkah mediasi yang akan Anda lakukan.',
     70, 15),
    ('Desain Arsitektur Microservices', 'hard', 'hard',
     'Rancang arsitektur microservices untuk aplikasi e-commerce dengan 3 service. Jelaskan komunikasi antar service.',
     150, 50)
ON CONFLICT DO NOTHING;