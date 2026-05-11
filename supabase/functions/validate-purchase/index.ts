import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// Edge Function: validate-purchase
// Valida compras in-app desde RevenueCat webhook
// y otorga items al inventario del niño
// ============================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// TODO (Fase 6): validar firma HMAC del webhook de RevenueCat
const REVENUECAT_WEBHOOK_SECRET = Deno.env.get('REVENUECAT_WEBHOOK_SECRET')!;

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // TODO (Fase 6): Implementar validación de firma RevenueCat
  // y procesamiento del evento (PURCHASE, RENEWAL, CANCELLATION)
  const body = await req.json();
  console.log('[validate-purchase] webhook received:', body?.event?.type);

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
