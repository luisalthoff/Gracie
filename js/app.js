init();

function init() {
  loadDatabase();
  drawScreen();
}

function drawScreen() {
  const app = document.getElementById("app");

  app.innerHTML = "";

  for (const category of db.categories) {
    const categoryElement = createCategoryElement(category);
    app.appendChild(categoryElement);
  }
}

function createCategoryElement(category) {
  const section = document.createElement("section");

  section.className = "category";
  section.id = "category-" + category.id;

  if (db.openCategoryId === category.id) {
    section.classList.add("open");
  }

  const header = createCategoryHeader(category);
  const panel = createItemsPanel(category);

  section.appendChild(header);
  section.appendChild(panel);

  return section;
}

function createCategoryHeader(category) {
  const button = document.createElement("button");

  button.className = "category-header";
  button.onclick = function () {
    toggleCategory(category.id);
  };

  const icon = document.createElement("span");
  icon.className = "category-icon";
  icon.textContent = category.icon;

  const name = document.createElement("span");
  name.className = "category-name";
  name.textContent = category.name;

  const arrow = document.createElement("span");
  arrow.className = "category-arrow";
  arrow.textContent = "›";

  button.appendChild(icon);
  button.appendChild(name);
  button.appendChild(arrow);

  return button;
}

function createItemsPanel(category) {
  const panel = document.createElement("div");

  panel.className = "items-panel";

  for (const item of category.items) {
    const row = createItemRow(item);
    panel.appendChild(row);
  }

  return panel;
}

function createItemRow(item) {
  const row = document.createElement("div");

  row.className = "item-row";
  row.id = "item-" + item.id;

  const star = createStarButton(item);
  const name = createItemName(item);
  const check = createCheckButton(item);

  row.appendChild(star);
  row.appendChild(name);
  row.appendChild(check);

  return row;
}

function createStarButton(item) {
  const button = document.createElement("button");

  button.className = "star-button";
  button.textContent = item.favorite ? "★" : "☆";

  if (item.favorite) {
    button.classList.add("favorite");
  }

  button.onclick = function () {
    toggleFavorite(item.id);
  };

  return button;
}

function createItemName(item) {
  const name = document.createElement("div");

  name.className = "item-name";
  name.textContent = item.name;

  return name;
}

function createCheckButton(item) {
  const button = document.createElement("button");

  button.className = "check-button";
  button.textContent = "✓";

  if (item.selected) {
    button.classList.add("selected");
  }

  button.onclick = function () {
    toggleSelected(item.id);
  };

  return button;
}

function toggleCategory(categoryId) {
  if (db.openCategoryId === categoryId) {
    db.openCategoryId = null;
  } else {
    db.openCategoryId = categoryId;
  }

  saveDatabase();
  drawScreen();
}

function toggleFavorite(itemId) {
  const item = findItem(itemId);

  if (!item) return;

  item.favorite = !item.favorite;
 
  saveDatabase();
  drawScreen();
}

function toggleSelected(itemId) {
  const item = findItem(itemId);

  if (!item) return;

  item.selected = !item.selected;

  saveDatabase();
  drawScreen();
}

function findItem(itemId) {
  for (const category of db.categories) {
    for (const item of category.items) {
      if (item.id === itemId) {
        return item;
      }
    }
  }

  return null;
}