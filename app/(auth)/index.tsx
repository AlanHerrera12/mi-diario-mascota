import { View, Text, Image } from 'react-native';
import { WebSafePressable } from '../../src/components/shared/WebSafePressable';

/** Static decorative stars — plain Views, zero pointer events, guaranteed non-blocking. */
function StaticStars() {
  const dots = [
    { top: '4%',  left: '5%',  size: 3, opacity: 0.5 },
    { top: '2%',  left: '78%', size: 2, opacity: 0.4 },
    { top: '10%', left: '42%', size: 2, opacity: 0.35 },
    { top: '18%', left: '91%', size: 3, opacity: 0.45 },
    { top: '28%', left: '18%', size: 2, opacity: 0.3 },
    { top: '38%', left: '63%', size: 2, opacity: 0.4 },
    { top: '52%', left: '7%',  size: 3, opacity: 0.35 },
    { top: '58%', left: '86%', size: 2, opacity: 0.45 },
    { top: '68%', left: '33%', size: 2, opacity: 0.3 },
    { top: '76%', left: '55%', size: 3, opacity: 0.4 },
    { top: '88%', left: '25%', size: 2, opacity: 0.35 },
    { top: '92%', left: '70%', size: 2, opacity: 0.3 },
  ];
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {dots.map((d, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: d.top as any, left: d.left as any,
            width: d.size, height: d.size, borderRadius: d.size / 2,
            backgroundColor: '#A78BFA',
            opacity: d.opacity,
          }}
        />
      ))}
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <View style={{
      flex: 1, backgroundColor: '#0D0626',
      justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 64, paddingBottom: 48,
    }}>
      {/* Static bg stars — no Reanimated, can't block clicks */}
      <StaticStars />

      {/* Tagline bubble */}
      <View style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24, paddingHorizontal: 24, paddingVertical: 16,
        marginTop: 8, borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
        alignSelf: 'center', maxWidth: 300, zIndex: 1,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', textAlign: 'center' }}>
          Habla, juega, y gana{' '}
          <Text style={{ color: '#EC4899' }}>recompensas</Text>
        </Text>
        <View style={{
          position: 'absolute', bottom: -12, left: '50%', marginLeft: -12,
          width: 0, height: 0,
          borderLeftWidth: 12, borderRightWidth: 12, borderTopWidth: 12,
          borderLeftColor: 'transparent', borderRightColor: 'transparent',
          borderTopColor: 'rgba(255,255,255,0.08)',
        }} />
      </View>

      {/* Pet area */}
      <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 32, zIndex: 1 }}>
        {/* Left speech bubble */}
        <View style={{
          backgroundColor: 'rgba(129,140,248,0.15)', borderRadius: 16,
          paddingHorizontal: 16, paddingVertical: 10, marginBottom: 20,
          alignSelf: 'flex-start', marginLeft: 8, maxWidth: 220,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.25)',
        }}>
          <Text style={{ fontSize: 13, color: '#A5B4FC', fontWeight: '600' }}>
            ¿Cómo fue tu día hoy? Cuéntame todo 💙
          </Text>
          <View style={{
            position: 'absolute', bottom: -8, left: 20,
            width: 0, height: 0,
            borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderTopColor: 'rgba(129,140,248,0.15)',
          }} />
        </View>

        {/* Pet avatar */}
        <View style={{
          width: 180, height: 180, borderRadius: 90,
          backgroundColor: '#2D1B69', alignItems: 'center', justifyContent: 'center',
          borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.35)',
          shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 24, elevation: 10,
        }}>
          <Image source={require('../../assets/pets/pet-dog.png')} style={{ width: 150, height: 150 }} resizeMode="contain" />
        </View>

        {/* Right speech bubble */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16,
          paddingHorizontal: 14, paddingVertical: 10, marginTop: 16,
          alignSelf: 'flex-end', marginRight: 8, maxWidth: 200,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
        }}>
          <Text style={{ fontSize: 13, color: '#C4B5FD', fontWeight: '600' }}>
            ¡Hola! Soy tu mejor amigo 🐾
          </Text>
          <View style={{
            position: 'absolute', top: -8, right: 20,
            width: 0, height: 0,
            borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 8,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderBottomColor: 'rgba(255,255,255,0.06)',
          }} />
        </View>
      </View>

      {/* Buttons — WebSafePressable renders native <button> on web for guaranteed clicks */}
      <View style={{ gap: 12, marginTop: 32, zIndex: 10 }}>
        <WebSafePressable
          href="/(auth)/parent-signup"
          style={{
            backgroundColor: '#EC4899',
            borderRadius: 32, paddingVertical: 18, alignItems: 'center',
            shadowColor: '#BE185D', shadowOpacity: 0.45, shadowRadius: 10, elevation: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', textAlign: 'center' }}>
            Soy un adulto — Crear cuenta
          </Text>
        </WebSafePressable>

        <WebSafePressable
          href="/(auth)/login"
          style={{ paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#A5B4FC', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
            Ya tengo cuenta →
          </Text>
        </WebSafePressable>
      </View>
    </View>
  );
}
