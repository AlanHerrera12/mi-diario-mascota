# Decisiones de Privacidad — MiDiarioMascota

Documentación de cada decisión que afecta la privacidad del niño,
con justificación y alternativas consideradas. Requerido por diseño.

---

## PD-001: No uso de LLMs generativos para responder al niño

**Decisión:** La mascota responde únicamente con frases pregrabadas seleccionadas
según el análisis de sentimiento. Nunca se envía el audio ni la transcripción
a un modelo generativo (GPT, Claude, etc.) para generar una respuesta.

**Justificación:**
- Protección infantil: los LLMs pueden generar contenido inapropiado o malinterpretado.
- Cumplimiento: COPPA y GDPR-K requieren consentimiento explícito para procesamiento
  automatizado de decisiones que afectan a menores. Una respuesta generativa sería
  considerada "toma de decisiones automatizada".
- Predictibilidad: las respuestas pregrabadas son auditables por padres y especialistas.
- Marketing: "tu hijo no habla con una IA" es un diferenciador clave de confianza.

**Alternativas descartadas:**
- GPT/Claude para respuestas → descartado por razones éticas y regulatorias.
- Fine-tuned model privado → costo prohibitivo para MVP, reconsiderar en v3.

---

## PD-002: Transcripciones encriptadas y no accesibles por defecto

**Decisión:** Las transcripciones completas se almacenan encriptadas. Los padres
NO las ven por defecto. Hay una opción explícita "Ver detalle completo" que:
1. Requiere re-ingreso del PIN.
2. Muestra un warning sobre privacidad del niño.
3. Queda registrada en log auditable.

**Justificación:**
- El diario es un espacio íntimo del niño. El objetivo es proteger su privacidad
  incluso frente a los propios padres, dentro de lo legalmente permitido.
- Los resúmenes y keywords dan al padre la información necesaria para el bienestar
  sin exponer cada palabra.
- El log auditable protege a la empresa: si hay un caso legal, podemos demostrar
  que el padre accedió conscientemente.

**Marco legal:** Cumple con GDPR Art. 8 (consentimiento de menores) y principio
de minimización de datos del GDPR Art. 5(1)(c).

---

## PD-003: Retención de audios a 7 días

**Decisión:** Los archivos de audio se borran automáticamente a los 7 días.
Solo se conserva el análisis (sentimiento, keywords, emociones). Los padres
pueden reducir este período en configuración.

**Justificación:**
- Minimización de datos: no hay necesidad de retener el audio una vez transcrito.
- El análisis tiene toda la información útil para el padre.
- Reduce superficie de ataque en caso de breach de seguridad.
- Cumple con GDPR Art. 5(1)(e) (limitación del plazo de conservación).

**Alternativas:** 24 horas (más seguro pero puede complicar re-procesamiento
si falla Whisper), 30 días (útil para auditoría pero riesgo innecesario).
7 días es el balance elegido.

---

## PD-004: Análisis determinístico de alertas críticas

**Decisión:** La detección de palabras clave de riesgo usa una lista curada
por especialistas, versionada en código (ver `supabase/functions/detect-alerts/index.ts`).
No se usa NLP probabilístico ni LLMs para esta detección.

**Justificación:**
- Un falso positivo (alerta incorrecta) genera alarma innecesaria en los padres
  y erosiona la confianza en la app.
- Un falso negativo (no detectar una señal real) puede tener consecuencias graves.
- La lista determinística es auditable: cada patrón tiene una justificación clínica.
- Los especialistas en protección infantil pueden revisar y actualizar la lista
  sin necesidad de re-entrenar un modelo.

**Proceso de actualización:** La lista de patrones requiere revisión de al menos
un especialista en psicología infantil antes de ser mergeada. Ver CONTRIBUTING.md (TODO).

---

## PD-005: Sin publicidad de terceros en perfiles infantiles

**Decisión:** Cero SDKs de publicidad en la zona del niño (`app/(kid)/`).
El revenue viene exclusivamente de suscripciones y compras in-app.

**Justificación:**
- Requerimiento de Kids Category (App Store / Play Store): apps en la categoría
  infantil no pueden tener publicidad conductual de terceros.
- COPPA prohibe recolección de datos para publicidad dirigida a menores de 13 años.
- GDPR-K ídem para menores según la edad de consentimiento digital del país.

**Nota:** El marketplace in-app (cosméticos) es parte del producto, no publicidad
de terceros. Los items son todos propios.

---

## PD-006: No recolección de información personal del niño

**Decisión:** El perfil del niño solo contiene: nombre/apodo (opcional, puede ser
un personaje como "Chispita"), rango de edad (no fecha exacta), y un avatar generado.
No se pide: apellido, foto real, escuela, nombre de amigos, dirección.

**Justificación:**
- COPPA § 312.2: "personal information" incluye nombre completo, dirección, foto.
  Minimizamos lo recolectado para no caer en estos supuestos.
- Si el niño menciona nombres de personas en el audio, esa info queda en la
  transcripción pero NO se extrae como dato estructurado.

---

## PD-007: Aislamiento total del perfil infantil

**Decisión:** Desde la interfaz del niño (`app/(kid)/`) es imposible:
- Acceder a configuración de cuenta.
- Ver información de suscripción o pagos.
- Salir a la zona de padres sin el PIN.
- Interactuar con redes sociales.

**Implementación:** El router de Expo valida en cada layout de `(kid)` que el
niño esté activo. El acceso al dashboard parental siempre requiere PIN.

---

## PD-008: Consentimiento parental verificable (COPPA/GDPR-K)

**Decisión:** Usamos un método de verificación combinado:
1. Email del padre + formulario de consentimiento explícito con checkboxes.
2. Para suscripción: validación de tarjeta de crédito (reconocida por FTC como
   prueba de mayoría de edad en COPPA).

**Marco legal:**
- FTC COPPA: "verifiable parental consent" puede lograrse mediante tarjeta de crédito.
- GDPR-K varía por país: España requiere 14 años, Alemania 16, otros 13.
  La app toma el más restrictivo por defecto (16) cuando el país es EU y no
  hay otra indicación.

**Pendiente:** En v2, integrar verificación de identidad digital (ej: eIDAS en EU).

---

_Toda decisión nueva debe agregarse aquí con formato PD-XXX antes de ser implementada._
