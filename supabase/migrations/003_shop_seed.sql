-- ============================================================
-- Migración 003 — Fase 6: economía de gemas + catálogo inicial
-- ============================================================

-- ============================================================
-- POLICY FALTANTE: permitir INSERT de transacciones de gemas
-- El padre autenticado inserta gemas para sus hijos.
-- ============================================================
CREATE POLICY "Padres insertan transacciones de sus niños"
  ON gem_transactions FOR INSERT
  WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- También streaks: UPDATE para registrar hablas
CREATE POLICY "Padres actualizan rachas de sus niños"
  ON streaks FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- ============================================================
-- SEED: catálogo inicial de la tienda
-- asset_url usa emojis como placeholders (serán reemplazados por
-- assets Rive/PNG en Fase 8 de polish).
-- ============================================================

-- OUTFITS
INSERT INTO shop_items (category, name, description, price_gems, rarity, asset_url, preview_url) VALUES
  ('outfit', 'Sombrero de explorador', 'Un sombrero perfecto para aventureros',  50, 'common',    '🎩', '🎩'),
  ('outfit', 'Capa de superhéroe',     'Vuela con estilo',                        80, 'common',    '🦸', '🦸'),
  ('outfit', 'Corona dorada',          'Para la mascota más real del reino',      150,'rare',      '👑', '👑'),
  ('outfit', 'Traje de astronauta',    'Listo para explorar el espacio',          200,'rare',      '🚀', '🚀'),
  ('outfit', 'Armadura épica',         'Protección máxima y estilo total',        400,'epic',      '🛡️', '🛡️'),
  ('outfit', 'Vestido de gala',        'Elegante para cualquier ocasión',         350,'epic',      '👗', '👗'),
  ('outfit', 'Traje legendario',       'Solo para los más valientes',            1000,'legendary', '✨', '✨');

-- ACCESORIOS
INSERT INTO shop_items (category, name, description, price_gems, rarity, asset_url, preview_url) VALUES
  ('accessory', 'Collar de flores',    'Colorido y alegre',                        30, 'common',    '🌸', '🌸'),
  ('accessory', 'Gafas de sol',        'Cool total',                               40, 'common',    '🕶️', '🕶️'),
  ('accessory', 'Alas de mariposa',    'Revolotea con gracia',                    120, 'rare',      '🦋', '🦋'),
  ('accessory', 'Arco iris en la cola','Un toque mágico',                         250, 'epic',      '🌈', '🌈'),
  ('accessory', 'Halo brillante',      'Brilla con luz propia',                   600, 'legendary', '😇', '😇');

-- EFECTOS
INSERT INTO shop_items (category, name, description, price_gems, rarity, asset_url, preview_url) VALUES
  ('effect', 'Destellos de estrellas', 'Dejá un rastro de estrellas al moverte',  80, 'common',    '⭐', '⭐'),
  ('effect', 'Corazones flotantes',    'Tu mascota irradia amor',                160, 'rare',      '💖', '💖'),
  ('effect', 'Aura de fuego',          'Efectos de llamas épicas',               500, 'epic',      '🔥', '🔥'),
  ('effect', 'Aura legendaria',        'Magia pura en cada movimiento',          900, 'legendary', '🌟', '🌟');

-- ANIMACIONES
INSERT INTO shop_items (category, name, description, price_gems, rarity, asset_url, preview_url) VALUES
  ('animation', 'Baile feliz',        'Tu mascota baila de alegría',             100, 'common',    '💃', '💃'),
  ('animation', 'Vuelta de campana',  'Un giro impresionante',                   200, 'rare',      '🌀', '🌀'),
  ('animation', 'Baile épico',        'La rutina de baile más cool',             500, 'epic',      '🕺', '🕺');
