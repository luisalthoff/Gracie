const DOUBLE_TAP_DELAY = 320;

let shoppingLastTapItemId = null;
let shoppingLastTapTime = 0;
let shoppingTapResetTimer = null;

function compareFavoriteThenName(a, b) {
  const favoriteDifference = Number(b.favorite) - Number(a.favorite);

  if (favoriteDifference !== 0) {
    return favoriteDifference;
  }

  return a.name.localeCompare(b.name, undefined, {
    sensitivity: "base",
  });
}

function itemPanelCreate(category, selectedState = false) {
  const panel = document.createElement("div");
  panel.className = "pnl";

  const items = category.items
    .filter((item) => item.selected === selectedState)
    .sort(compareFavoriteThenName);

  if (items.length === 0) {
    panel.appendChild(
      itemEmptyCreate(
        selectedState
          ? "Neni!  A lista tá vazia"
          : "Nada, nada, nada...",
      ),
    );

    return panel;
  }

  for (const item of items) {
    panel.appendChild(itemRowCreate(item));
  }

  return panel;
}

function shoppingPanelCreate() {
  const panel = document.createElement("div");
  panel.className = "pnl shopping-panel";

  const selectedItems = [];

  for (const category of db.categories) {
    for (const item of category.items) {
      if (item.selected) {
        selectedItems.push(item);
      }
    }
  }

  selectedItems.sort(compareFavoriteThenName);

  if (selectedItems.length === 0) {
    panel.appendChild(
      itemEmptyCreate("Selecione ítens à esquerda para preencher a lista de compras"),
    );
    return panel;
  }

  for (const item of selectedItems) {
    panel.appendChild(itemRowCreate(item));
  }

  return panel;
}

function itemEmptyCreate(message) {
  const empty = document.createElement("div");
  empty.className = "list-empty";
  empty.textContent = message;
  return empty;
}

function itemRowCreate(item) {
  const row = document.createElement("div");
  row.className = item.selected
    ? "item-row shopping-item-row"
    : "item-row prepare-item-row";
  row.id = `${item.selected ? "shop" : "prepare"}-item-${item.id}`;
  row.dataset.itemId = item.id;

  if (!item.selected) {
    row.appendChild(itemStarCreate(item));
  }

  row.appendChild(itemNameCreate(item));
  row.appendChild(itemArrowCreate(item));

  if (item.selected) {
    row.setAttribute("aria-label", `${item.name}. Double tap when collected.`);
    row.addEventListener("click", function () {
      shoppingRowTap(item.id);
    });
  } else {
    row.setAttribute("aria-label", `${item.name}. Add to shopping list.`);
    row.addEventListener("click", function () {
      itemSelectedToggle(item.id);
    });
  }

  return row;
}

function itemStarCreate(item) {
  const button = document.createElement("button");
  button.className = "star-button";
  button.type = "button";
  button.setAttribute(
    "aria-label",
    item.favorite ? "Remove from favorites" : "Add to favorites",
  );
  button.textContent = item.favorite ? "★" : "☆";

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    itemFavoriteToggle(item.id);
  });

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
  button.className = "arrow-button";
  button.type = "button";
  button.setAttribute(
    "aria-label",
    item.selected ? "Mark as collected" : "Add to shopping list",
  );
  button.textContent = item.selected ? "<" : ">";

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    shoppingTapReset();
    itemSelectedToggle(item.id);
  });

  return button;
}

function shoppingRowTap(itemId) {
  const now = Date.now();
  const isDoubleTap =
    shoppingLastTapItemId === itemId &&
    now - shoppingLastTapTime <= DOUBLE_TAP_DELAY;

  if (isDoubleTap) {
    shoppingTapReset();
    itemSelectedToggle(itemId);
    return;
  }

  shoppingLastTapItemId = itemId;
  shoppingLastTapTime = now;

  clearTimeout(shoppingTapResetTimer);
  shoppingTapResetTimer = setTimeout(
    shoppingTapReset,
    DOUBLE_TAP_DELAY + 20,
  );
}

function shoppingTapReset() {
  clearTimeout(shoppingTapResetTimer);
  shoppingTapResetTimer = null;
  shoppingLastTapItemId = null;
  shoppingLastTapTime = 0;
}

function itemFavoriteToggle(itemId) {
  const item = databaseFindItem(itemId);
  if (!item) return;

  item.favorite = !item.favorite;
  storageSave();
  listsDraw();
}

function itemSelectedToggle(itemId) {
  const item = databaseFindItem(itemId);
  if (!item) return;

  item.selected = !item.selected;
  storageSave();
  listsDraw();
}
