import { SKILLS } from '../config/skills';
import SkillNode from './SkillNode';

export default function SkillTree() {
  // Organize skills by path
  const centralNode = SKILLS.find(s => s.id === 'passive_generation');
  const leftPath = SKILLS.filter(s => s.id.startsWith('mana_boost'));
  const rightPath = SKILLS.filter(s => s.id.startsWith('fill_rate'));

  return (
    <div className="w-full max-w-full md:w-[792px] min-h-[650px] overflow-x-auto px-2 md:px-0">
      <div className="flex flex-col items-center gap-3 min-w-[360px] md:min-w-0">
        {/* Central node */}
        {centralNode && (
          <div className="flex justify-center">
            <SkillNode skill={centralNode} />
          </div>
        )}

        {/* Connecting lines - split into two */}
        <div className="flex gap-8 md:gap-16 justify-center w-full max-w-[280px] md:max-w-[416px]">
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="h-4 w-px bg-gray-600"></div>
        </div>

        {/* Two paths */}
        <div className="flex gap-8 md:gap-16 items-start justify-center">
          {/* Left path - Mana */}
          <div className="flex flex-col gap-2 items-center w-[160px] md:w-[200px]">
            {leftPath.map((skill, index) => (
              <div key={skill.id} className="flex flex-col items-center w-full">
                {index > 0 && <div className="h-4 w-px bg-gray-600"></div>}
                <SkillNode skill={skill} />
              </div>
            ))}
          </div>

          {/* Right path - Fill Rate */}
          <div className="flex flex-col gap-2 items-center w-[160px] md:w-[200px]">
            {rightPath.map((skill, index) => (
              <div key={skill.id} className="flex flex-col items-center w-full">
                {index > 0 && <div className="h-4 w-px bg-gray-600"></div>}
                <SkillNode skill={skill} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
