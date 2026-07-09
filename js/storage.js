function storageSave() {
  const text = JSON.stringify(db);
  
  localStorage.setItem(APP.storageKey, text);
}

function storageLoad() {
  const text = localStorage.getItem(APP.storageKey);

  if (!text) return;
  
  const savedDb = JSON.parse(text);

  db.openCategoryId = savedDb.openCategoryId;
  db.categories = savedDb.categories;
}

function storageReset() {
  localStorage.removeItem(APP.storageKey);

  location.reload();
}