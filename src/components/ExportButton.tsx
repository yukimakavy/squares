import useGameStore from '../stores/gameStore';
import { prepareSaveData } from '../utils/saveData';

export default function ExportButton() {
  const handleExport = () => {
    const state = useGameStore.getState();
    const saveData = {
      ...prepareSaveData(state),
      timestamp: Date.now(),
    };

    const dataStr = JSON.stringify(saveData, null, 2);
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `squares-save-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
    >
      Export
    </button>
  );
}
