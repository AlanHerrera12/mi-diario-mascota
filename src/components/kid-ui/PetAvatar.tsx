import { Text } from 'react-native';
import type { PetSpecies } from '../../types';
import { PetDogSVG }     from './PetDogSVG';
import { PetCatSVG }     from './PetCatSVG';
import { PetRabbitSVG }  from './PetRabbitSVG';
import { PetBearSVG }    from './PetBearSVG';     // polar-bear
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

export function PetAvatar({ species, size = 180, mood = 'idle', baseColor }: Props) {
  switch (species) {
    case 'dog':        return <PetDogSVG    size={size} mood={mood} baseColor={baseColor} />;
    case 'cat':        return <PetCatSVG    size={size} mood={mood} baseColor={baseColor} />;
    case 'rabbit':     return <PetRabbitSVG size={size} mood={mood} baseColor={baseColor} />;
    case 'polar-bear': return <PetBearSVG   size={size} mood={mood} />;
    case 'tiger':      return <PetTigerSVG  size={size} mood={mood} />;
    case 'dragon':     return <PetDragonSVG size={size} mood={mood} />;
    case 'unicorn':    return <PetUnicornSVG size={size} mood={mood} />;
    default:           return <Text style={{ fontSize: size * 0.45 }}>🐾</Text>;
  }
}
