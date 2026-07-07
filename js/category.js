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
  const btn = document.createElement("button");

  btn.className = "btn btn-header";

  btn.addEventListener("click", function (){categoryToggle(category.id);});

  const imgCtg = document.createElement("img");
  imgCtg.src = category.icon;
  imgCtg.classList = "imgCatHead";

  const name = document.createElement("span");
  name.className = "categoria";
  name.textContent = category.name;

  btn.appendChild(imgCtg);
  btn.appendChild(name);
  btn.style.color = "#ffffff";

  return btn;
}

function categoryToggle(categoryId)
{
  if (db.openCategoryId === categoryId)
  {
    db.openCategoryId = null;
  }
  else
  {
    db.openCategoryId = categoryId;
  }

  storageSave();
  screenDraw();
}