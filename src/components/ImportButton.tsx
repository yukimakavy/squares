import { useRef } from 'react';

const SAVE_KEY = 'squares_game_save';

export default function ImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    console.log('Import button clicked');
    console.log('File input ref:', fileInputRef.current);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        console.log('File content loaded, length:', content.length);

        const saveData = JSON.parse(content);
        console.log('Save data parsed:', saveData);

        // Validate the save data has required fields
        if (!saveData.layer) {
          console.error('Missing layer in save data');
          alert('Invalid save file format: missing layer data');
          return;
        }

        if (saveData.prestigeLevel === undefined) {
          console.error('Missing prestigeLevel in save data');
          alert('Invalid save file format: missing prestigeLevel');
          return;
        }

        console.log('Validation passed, saving to localStorage...');

        // Set flag to prevent autosave from running on beforeunload
        sessionStorage.setItem('importing_save', 'true');

        // Save directly to localStorage with the correct key
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('Saved to localStorage, reloading...');

        // Reload the page to load the new save
        window.location.reload();
      } catch (error) {
        console.error('Failed to import save:', error);
        alert(`Failed to import save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      alert('Failed to read file');
    };

    reader.readAsText(file);

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleImport}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
      >
        Import
      </button>
    </>
  );
}
