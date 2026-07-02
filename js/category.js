function categoryElementCreate(category) {
  const section = document.createElement("section");

  section.className = "category";
  section.id = "category-" + category.id;

  if (db.openCategoryId === category.id) {
    section.classList.add("open");
  }

  section.appendChild(categoryHeaderCreate(category));
  section.appendChild(itemPanelCreate(category));

  return section;
}

function categoryHeaderCreate(category) {
  const button = document.createElement("button");

  button.className = "category-header";

  button.onclick = function () {
    categoryToggle(category.id);
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

function categoryToggle(categoryId) {
  if (db.openCategoryId === categoryId) {
    db.openCategoryId = null;
  } else {
    db.openCategoryId = categoryId;
  }

  storageSave();
  screenDraw();
}