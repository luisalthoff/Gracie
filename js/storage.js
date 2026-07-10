let storageAvailable = true;

function storageRead(key) {
  if (!storageAvailable) return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    storageAvailable = false;
    console.warn("Persistent storage is unavailable in this preview.", error);
    return null;
  }
}

function storageWrite(key, value) {
  if (!storageAvailable) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    storageAvailable = false;
    console.warn(
      "Changes will work for this session, but this preview cannot save them.",
      error,
    );
    return false;
  }
}

function storageRemove(key) {
  if (!storageAvailable) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    storageAvailable = false;
    console.warn("Persistent storage is unavailable in this preview.", error);
    return false;
  }
}

function storageSave() {
  storageWrite(APP.storageKey, JSON.stringify(db));
}

function storageLoad() {
  const text = storageRead(APP.storageKey);

  if (!text) return;

  try {
    const savedDb = JSON.parse(text);

    db.openCategoryId = savedDb.openCategoryId;
    db.categories = savedDb.categories;
  } catch (error) {
    console.warn("Saved Gracie data could not be loaded.", error);
  }
}

function storageReset() {
  storageRemove(APP.storageKey);
  location.reload();
}
