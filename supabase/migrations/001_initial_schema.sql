-- ============================================================
-- Migración inicial — MiDiarioMascota
-- Ejecutar con: supabase db push
-- ============================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PADRES (cuenta primaria con auth real)
-- ============================================================
CREATE TABLE parents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL,
  consent_given_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  consent_method    TEXT NOT NULL CHECK (consent_method IN ('credit_card', 'gov_id', 'email_plus_form')),
  country_code  TEXT NOT NULL DEFAULT 'AR',
  parent_pin_hash   TEXT NOT NULL,
  subscription_status TEXT NOT NULL DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'expired', 'free')),
  trial_started_at  TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- El id de parents mapea 1:1 con auth.users de Supabase
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres solo ven sus propios datos"
  ON parents FOR ALL USING (auth.uid() = id);

-- ============================================================
-- NIÑOS (sub-perfiles bajo el padre)
-- ============================================================
CREATE TABLE children (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id     UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  age_range     TEXT NOT NULL CHECK (age_range IN ('5-7', '8-10', '11-13', '14+')),
  avatar_seed   TEXT NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres ven solo a sus niños"
  ON children FOR ALL
  USING (parent_id = auth.uid());

-- ============================================================
-- MASCOTAS
-- ============================================================
CREATE TABLE pets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  species       TEXT NOT NULL CHECK (species IN (
    'dog','cat','rabbit','giraffe','elephant','bear','dragon','unicorn'
  )),
  customization JSONB NOT NULL DEFAULT '{"baseColor":"#FF9800","accentColor":"#FFF5E6","equippedItems":[]}',
  level         INT NOT NULL DEFAULT 1,
  happiness     INT NOT NULL DEFAULT 100 CHECK (happiness BETWEEN 0 AND 100),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres gestionan mascotas de sus niños"
  ON pets FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- ENTRADAS DEL DIARIO
-- ============================================================
CREATE TABLE diary_entries (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id              UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  audio_storage_path    TEXT,
  audio_duration_seconds INT NOT NULL DEFAULT 0,
  -- transcript se encripta en backend antes de insertar
  transcript            TEXT,
  transcript_redacted   TEXT,
  sentiment_score       FLOAT CHECK (sentiment_score BETWEEN -1.0 AND 1.0),
  detected_emotions     JSONB NOT NULL DEFAULT '[]',
  keywords              JSONB NOT NULL DEFAULT '[]',
  alert_flags           JSONB NOT NULL DEFAULT '[]',
  audio_deleted_at      TIMESTAMP WITH TIME ZONE,
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
-- Padres acceden a las entradas de sus niños
CREATE POLICY "Padres ven entradas de sus niños"
  ON diary_entries FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- Las Edge Functions insertan/actualizan usando service_role — sin RLS para ellas

-- ============================================================
-- RESÚMENES PARENTALES
-- ============================================================
CREATE TABLE parent_summaries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  period          TEXT NOT NULL CHECK (period IN ('daily', 'weekly')),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  summary_text    TEXT NOT NULL,
  dominant_emotions JSONB NOT NULL DEFAULT '[]',
  topics          JSONB NOT NULL DEFAULT '[]',
  alert_level     TEXT NOT NULL DEFAULT 'none'
    CHECK (alert_level IN ('none', 'low', 'medium', 'high')),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE parent_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres ven resúmenes de sus niños"
  ON parent_summaries FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- ALERTAS CRÍTICAS
-- ============================================================
CREATE TABLE parent_alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  diary_entry_id  UUID REFERENCES diary_entries(id) ON DELETE SET NULL,
  alert_type      TEXT NOT NULL CHECK (alert_type IN ('bullying','self_harm','abuse','severe_distress')),
  severity        TEXT NOT NULL CHECK (severity IN ('low','medium','high')),
  context_snippet TEXT,
  read_at         TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE parent_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres ven alertas de sus niños"
  ON parent_alerts FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- ECONOMÍA DE GEMAS
-- ============================================================
CREATE TABLE gem_transactions (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount    INT NOT NULL,
  reason    TEXT NOT NULL CHECK (reason IN (
    'daily_talk','streak_bonus','purchase','shop_buy','daily_task'
  )),
  metadata  JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gem_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres ven transacciones de gemas de sus niños"
  ON gem_transactions FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- Vista calculada de balance de gemas por niño
CREATE VIEW gem_balances AS
SELECT child_id, SUM(amount) AS balance
FROM gem_transactions
GROUP BY child_id;

-- ============================================================
-- RACHAS
-- ============================================================
CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID NOT NULL UNIQUE REFERENCES children(id) ON DELETE CASCADE,
  current_streak  INT NOT NULL DEFAULT 0,
  longest_streak  INT NOT NULL DEFAULT 0,
  last_talk_date  DATE,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres ven rachas de sus niños"
  ON streaks FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- CATÁLOGO DEL MARKETPLACE
-- ============================================================
CREATE TABLE shop_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category        TEXT NOT NULL CHECK (category IN ('outfit','accessory','effect','animation','species')),
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  price_gems      INT CHECK (price_gems >= 0),
  price_real_cents INT CHECK (price_real_cents >= 0),
  is_premium_only BOOLEAN NOT NULL DEFAULT false,
  rarity          TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common','rare','epic','legendary')),
  asset_url       TEXT NOT NULL DEFAULT '',
  preview_url     TEXT NOT NULL DEFAULT '',
  available_from  DATE,
  available_until DATE
);

-- El catálogo es público (lectura)
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Catálogo visible para todos los autenticados"
  ON shop_items FOR SELECT TO authenticated USING (true);

-- ============================================================
-- INVENTARIO DEL NIÑO
-- ============================================================
CREATE TABLE child_inventory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  shop_item_id UUID NOT NULL REFERENCES shop_items(id),
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  equipped    BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (child_id, shop_item_id)
);

ALTER TABLE child_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Padres gestionan inventario de sus niños"
  ON child_inventory FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- ÍNDICES para queries frecuentes
-- ============================================================
CREATE INDEX idx_diary_entries_child_created ON diary_entries(child_id, created_at DESC);
CREATE INDEX idx_parent_alerts_child_unread ON parent_alerts(child_id) WHERE read_at IS NULL;
CREATE INDEX idx_gem_transactions_child ON gem_transactions(child_id, created_at DESC);
CREATE INDEX idx_shop_items_available ON shop_items(available_from, available_until);
