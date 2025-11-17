import { SPELLS } from '../config/spells';
import SpellButton from './SpellButton';

export default function Spells() {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex flex-wrap gap-2">
        {SPELLS.map((spell) => (
          <SpellButton key={spell.id} spell={spell} />
        ))}
      </div>
    </div>
  );
}
