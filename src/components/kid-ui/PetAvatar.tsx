import { Text, Image } from 'react-native';
import type { PetSpecies } from '../../types';
import { PetCatSVG }     from './PetCatSVG';
import { PetRabbitSVG }  from './PetRabbitSVG';
import { PetBearSVG }    from './PetBearSVG';
import { PetTigerSVG }   from './PetTigerSVG';
import { PetDragonSVG }  from './PetDragonSVG';
import { PetUnicornSVG } from './PetUnicornSVG';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';

interface Props {
  species: PetSpecies;
  size?: number;
  mood?: Mood;
  baseColor?: string;
}

// PNG assets (generated AI art — replace SVG when available)
const PET_PNGS: Partial<Record<PetSpecies, ReturnType<typeof require>>> = {
  dog: require('../../../assets/pets/pet-dog.png'),
};

export function PetAvatar({ species, size = 180, mood = 'idle', baseColor }: Props) {
  // Use PNG if available for this species
  const png = PET_PNGS[species];
  if (png) {
    return (
      <Image
        source={png}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  // Fall back to SVG for species without a PNG yet
  switch (species) {
    case 'cat':        return <PetCatSVG    size={size} mood={mood} baseColor={baseColor} />;
    case 'rabbit':     return <PetRabbitSVG size={size} mood={mood} baseColor={baseColor} />;
    case 'polar-bear': return <PetBearSVG   size={size} mood={mood} />;
    case 'tiger':      return <PetTigerSVG  size={size} mood={mood} />;
    case 'dragon':     return <PetDragonSVG size={size} mood={mood} />;
    case 'unicorn':    return <PetUnicornSVG size={size} mood={mood} />;
    default:           return <Text style={{ fontSize: size * 0.45 }}>🐾</Text>;
  }
}
