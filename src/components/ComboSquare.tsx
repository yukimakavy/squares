import type { ComboSquare as ComboSquareType } from '../types/game';

interface ComboSquareProps {
  square: ComboSquareType;
}

const COMBO_COLORS = {
  blue: '#3b82f6',
  pink: '#ec4899',
  green: '#10b981',
  orange: '#f97316',
  white: '#f3f4f6',
};

export default function ComboSquare({ square }: ComboSquareProps) {
  const fillPercentage = square.fillProgress * 100;
  const backgroundColor = square.color ? COMBO_COLORS[square.color] : '#374151';

  return (
    <div className="relative w-14 h-14 md:w-20 md:h-20 bg-gray-700 rounded-md overflow-hidden border border-gray-500 shadow-md">
      {/* Fill animation from bottom to top */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-100"
        style={{
          height: `${fillPercentage}%`,
          backgroundColor: backgroundColor,
          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)',
        }}
      />
      {/* Top highlight gradient for depth */}
      {fillPercentage > 0 && (
        <div
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent)',
          }}
        />
      )}
    </div>
  );
}
