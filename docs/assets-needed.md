# Assets Pendientes — MiDiarioMascota

Lista corriente de assets necesarios antes del lanzamiento.
Actualizar este archivo cuando se agregue o resuelva un asset.

---

## Animaciones de Mascotas (Rive) — ALTA PRIORIDAD

| ID | Descripción | Formato | Estado | Usado en |
|----|-------------|---------|--------|----------|
| `pet/dog-idle.riv` | Perro — animación idle (respirar, parpadear) | Rive | ❌ Pendiente | `(kid)/home.tsx` |
| `pet/dog-listening.riv` | Perro — escuchando (orejas animadas, cabeza inclinada) | Rive | ❌ Pendiente | `(kid)/talk.tsx` |
| `pet/dog-happy.riv` | Perro — celebrando (saltar, mover cola) | Rive | ❌ Pendiente | `(kid)/home.tsx` |
| `pet/dog-sleepy.riv` | Perro — durmiendo (buenas noches) | Rive | ❌ Pendiente | `(kid)/goodnight.tsx` |
| `pet/dog-missing-you.riv` | Perro — "te extrañé" (cuando no habló días) | Rive | ❌ Pendiente | `(kid)/home.tsx` |
| `pet/cat-idle.riv` | Gato — animación idle | Rive | ❌ Pendiente | — |
| `pet/cat-listening.riv` | Gato — escuchando | Rive | ❌ Pendiente | — |
| `pet/rabbit-idle.riv` | Conejo — animación idle | Rive | ❌ Pendiente | — |
| `pet/bear-idle.riv` | Oso — animación idle | Rive | ❌ Pendiente | — |

> **Nota para el diseñador:** Las animaciones deben exportarse con state machines nombradas:
> `idle`, `listening`, `happy`, `sleepy`, `missing_you`, `celebrating`.
> Paleta de colores base personalizable via runtime properties de Rive.

---

## Micro-animaciones UI (Lottie)

| ID | Descripción | Estado |
|----|-------------|--------|
| `ui/confetti-burst.json` | Confetti suave al completar 1 minuto | ❌ Pendiente |
| `ui/gem-collect.json` | Animación de recolección de gemas | ❌ Pendiente |
| `ui/streak-fire.json` | Llama de racha (número de días) | ❌ Pendiente |
| `ui/recording-ring.json` | Anillo de progreso que se llena al minuto | ❌ Pendiente |
| `ui/stars-night.json` | Fondo de pantalla de buenas noches | ❌ Pendiente |
| `ui/welcome-wave.json` | Mascota saludando en pantalla de bienvenida | ❌ Pendiente |

---

## Ilustraciones (PNG/SVG)

| ID | Descripción | Estado |
|----|-------------|--------|
| `illustrations/onboarding-1.png` | Niño hablando con mascota (splash de onboarding) | ❌ Pendiente |
| `illustrations/parent-dashboard-empty.png` | Estado vacío del dashboard parental | ❌ Pendiente |
| `illustrations/alert-resource.png` | Ícono de recursos de ayuda en alertas | ❌ Pendiente |

---

## Audios Pregrabados de Mascotas

> Las mascotas responden con frases pregrabadas — NUNCA con LLM generativo.

| ID | Texto del audio | Idioma | Estado |
|----|----------------|--------|--------|
| `audio-responses/dog/greeting_morning.m4a` | "¡Hola! ¡Qué bueno verte!" | es-AR | ❌ Pendiente |
| `audio-responses/dog/greeting_night.m4a` | "¡Cuéntame todo! Te escucho..." | es-AR | ❌ Pendiente |
| `audio-responses/dog/reaction_happy.m4a` | "¡Guau, qué bien! Me alegra mucho" | es-AR | ❌ Pendiente |
| `audio-responses/dog/reaction_sad.m4a` | "Oh... a veces las cosas son difíciles. Pero estoy acá" | es-AR | ❌ Pendiente |
| `audio-responses/dog/goodnight.m4a` | "Buenas noches. ¡Hasta mañana!" | es-AR | ❌ Pendiente |
| `audio-responses/dog/streak_3.m4a` | "¡Tres días seguidos! ¡Eres increíble!" | es-AR | ❌ Pendiente |
| `audio-responses/dog/streak_7.m4a` | "¡Una semana completa! ¡Esto lo merecemos celebrar!" | es-AR | ❌ Pendiente |

> **Nota:** Necesitamos al menos 5 variantes por respuesta para evitar repetición.
> Actor de voz: preferiblemente voz cálida, neutra, no exageradamente infantilizada.

---

## Efectos de Sonido (SFX)

| ID | Descripción | Estado |
|----|-------------|--------|
| `sfx/gem-collect.wav` | Sonido al recolectar gema | ❌ Pendiente |
| `sfx/streak-milestone.wav` | Sonido de racha alcanzada | ❌ Pendiente |
| `sfx/recording-start.wav` | Bip suave al empezar a grabar | ❌ Pendiente |
| `sfx/recording-minimum-reached.wav` | Chime al llegar al minuto | ❌ Pendiente |
| `sfx/goodnight-transition.wav` | Música de cuna suave (fade out) | ❌ Pendiente |
| `sfx/shop-purchase.wav` | Sonido de compra exitosa | ❌ Pendiente |

---

## Íconos de App Store

| Plataforma | Tamaño | Estado |
|------------|--------|--------|
| iOS App Icon | 1024×1024 px | ❌ Pendiente |
| Android Adaptive Icon (foreground) | 432×432 px | ❌ Pendiente |
| Splash Screen | 1284×2778 px | ❌ Pendiente |

---

## Cosméticos del Marketplace (Items iniciales)

> Mínimo 20 items para el launch. Al menos 5 por categoría.

| ID | Nombre | Categoría | Rareza | Estado |
|----|--------|-----------|--------|--------|
| `outfits/dog-astronaut` | Traje de astronauta | outfit | epic | ❌ Pendiente |
| `outfits/dog-chef` | Delantal de chef | outfit | rare | ❌ Pendiente |
| `accessories/dog-sunglasses` | Anteojos de sol | accessory | common | ❌ Pendiente |
| `accessories/dog-bow` | Moño brillante | accessory | common | ❌ Pendiente |
| `effects/hearts` | Lluvia de corazones | effect | rare | ❌ Pendiente |
| `effects/stars` | Explosión de estrellas | effect | rare | ❌ Pendiente |

---

_Última actualización: Fase 1 (Bootstrap). Actualizar cuando un asset esté listo._
