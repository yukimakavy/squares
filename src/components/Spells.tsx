import { SPELLS } from '../config/spells';
import SpellButton from './SpellButton';

export default function Spells() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-x-auto">
      <div className="flex gap-2 p-3">
        {SPELLS.map((spell) => (
          <SpellButton key={spell.id} spell={spell} />
        ))}
      </div>
    </div>
  );
}
