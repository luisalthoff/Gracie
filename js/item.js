function itemPanelCreate(category) {
  const panel = document.createElement("div");

  panel.className = "items-panel";

  for (const item of category.items) {
    panel.appendChild(itemRowCreate(item));
  }

  return panel;
}

function itemRowCreate(item) {
  const row = document.createElement("div");

  row.className = "item-row";
  row.id = "item-" + item.id;

  row.appendChild(itemStarCreate(item));
  row.appendChild(itemNameCreate(item));
  row.appendChild(itemCheckCreate(item));

  return row;
}

function itemStarCreate(item) {
  const button = document.createElement("button");

  button.className = "star-button";
  button.textContent = item.favorite ? "★" : "☆";

  if (item.favorite) {
    button.classList.add("favorite");
  }

  button.onclick = function () {
    itemFavoriteToggle(item.id);
  };

  return button;
}

function itemNameCreate(item) {
  const name = document.createElement("div");

  name.className = "item-name";
  name.textContent = item.name;

  return name;
}

function itemCheckCreate(item) {
  const button = document.createElement("button");

  button.className = "check-button";
  button.textContent = "✓";

  if (item.selected) {
    button.classList.add("selected");
  }

  button.onclick = function () {
    itemSelectedToggle(item.id);
  };

  return button;
}

function itemFavoriteToggle(itemId) {
  const item = itemFind(itemId);

  if (!item) return;

  item.favorite = !item.favorite;

  storageSave();
  screenDraw();
}

function itemSelectedToggle(itemId) {
  const item = itemFind(itemId);

  if (!item) return;

  item.selected = !item.selected;

  storageSave();
  screenDraw();
}

function itemFind(itemId) {
  for (const category of db.categories) {
    for (const item of category.items) {
      if (item.id === itemId) {
        return item;
      }
    }
  }

  return null;
}