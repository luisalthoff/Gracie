function screenDraw() {
  const app = elementGet("app");

  elementClear(app);

  resetButton();
  renderFavorites(app);
  renderCategories(app);
}

function renderCategories(app) {
  for (const category of db.categories) {
    app.appendChild(categoryElementCreate(category));
  }
}

function renderFavorites(app) {
  const groups = databaseFindFavoriteGroups();

  if (groups.length === 0) return;

  app.appendChild(favoriteElementCreate(groups));
}

function resetButton() {
  const btn = document.createElement("button");
  const app = document.getElementById("app");

  btn.className = "btn btn-reset";
  btn.id = "btnReset";
  btn.textContent = "Reset";
  btn.style.position = app.appendChild(btn);

  btn.addEventListener("click", function () {
    storageReset();
  });

  app.appendChild(btn);
  
  return btn;
}
