export const exportStorage = async () => {
  const data = await storage.getItems(['local:help', 'local:glossary']);
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'helpline.json';
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
};

export const importStorage = async () => {
  // fileを選択する
  const file = await new Promise<File | null>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        resolve(target.files[0]);
      } else {
        resolve(null);
      }
    };
    input.click();
  });
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target?.result as string;
    const data = JSON.parse(text);
    await storage.setItems(data);
  };
  reader.readAsText(file);
};
