function itemPanelCreate(category)
{
  const panel = document.createElement("div");
 
  panel.className = "pnl";

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
  row.appendChild(itemArrowCreate(item));

  return row;
}

function itemStarCreate(item) {
  const button = document.createElement("button");

  button.className = "star-button";
  button.textContent = item.favorite ? "★" : "☆";

  button.addEventListener("click", function () {itemFavoriteToggle(item.id);});

  return button;
}

function itemNameCreate(item) {
  const name = document.createElement("div");

  name.className = "item-name";
  name.textContent = item.name;

  return name;
}

function itemArrowCreate(item) {
  const button = document.createElement("button");

  button.textContent = "➤";
  button.className = item.selected ? "arrow-button" : "arrow-button-sel";
  
  button.addEventListener("click", function () {
    itemSelectedToggle(item.id);
  });

  return button;
}

function itemFavoriteToggle(itemId)
{
    const item = databaseFindItem(itemId);
  
    if (!item) return;

    item.favorite = !item.favorite;
  
    storageSave();
    screenDraw();
}

function itemSelectedToggle(itemId)
{
    const item = databaseFindItem(itemId);

    if (!item) return;

    item.selected = !item.selected;

    storageSave();
    screenDraw();
}
