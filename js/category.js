function showCategories(ctgs) {
  for (const dbCtg of db.categories) {
    const btn = document.createElement("button");

    btn.id = "btn-" + dbCtg.id;
    btn.className = "btn";
    if (db.openCategoryId === dbCtg.id) {
      btn.classList.add("open");
    }

    btn.addEventListener("click", function () {
      categoryToggle(dbCtg.id);
      showItems(dbCtg);
    });

    const imgCtg = document.createElement("img");
    imgCtg.src = dbCtg.icon;
    imgCtg.classList = "imgCtg";
    btn.appendChild(imgCtg);
    ctgs.appendChild(btn);
  }

  return ctgs;
}

function showItems(category) {
  const container = document.getElementById("prepare");
  container.innerHTML = "";
  container.appendChild(itemPanelCreate(category));
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

