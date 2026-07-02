const STORAGE_KEY = "gracie-db-v1";

function saveDatabase() {
  const text = JSON.stringify(db);

  localStorage.setItem(STORAGE_KEY, text);
}

function loadDatabase() {
  const text = localStorage.getItem(STORAGE_KEY);

  if (!text) return;

  const savedDb = JSON.parse(text);

  db.openCategoryId = savedDb.openCategoryId;
  db.categories = savedDb.categories;
}

function resetDatabase() {
  localStorage.removeItem(STORAGE_KEY);

  location.reload();
}