function showCategories(ctgs) {
  for (const dbCtg of db.categories) {
    const btn = document.createElement("button");
    btn.id = "btn-" + dbCtg.id;
    btn.className = "btnCtg";

    if (db.openCategoryId === dbCtg.id) {
      btn.classList.add("open");
    }

    btn.addEventListener("click", function () {
      categoryToggle(dbCtg.id);
    });

    const imgCtg = document.createElement("img");
    imgCtg.src = dbCtg.icon;
    imgCtg.className = "imgCtg";
    btn.appendChild(imgCtg);
    ctgs.appendChild(btn);
  }

  return ctgs;
}

function listsDraw() {
  const prepare = document.getElementById("prepare");
  const shop = document.getElementById("shop");

  elementClear(prepare);
  elementClear(shop);

  const category = db.openCategoryId == null ? null : databaseFindCategory(db.openCategoryId);
  console.log(category);

  if (category) {
    prepare.appendChild(itemPanelCreate(category, false));
  } else {
    prepare.appendChild(itemEmptyCreate("Neni, escolhe um tipo de produto aí. Não esquece da coca-zero"));
  }

  shop.appendChild(shoppingPanelCreate());
}

function categoryToggle(categoryId) {
  db.openCategoryId = db.openCategoryId === categoryId ? null : categoryId;
  storageSave();
  screenDraw();
}
