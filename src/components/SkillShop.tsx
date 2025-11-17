import { SKILLS } from '../config/skills';
import SkillShopItem from './SkillShopItem';

export default function SkillShop() {
  return (
    <div className="bg-gray-800 rounded-lg p-2 overflow-y-auto max-h-96 md:w-64 md:max-h-none md:h-[428px]">
      <div className="space-y-2">
        {SKILLS.map((skill) => (
          <SkillShopItem key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
