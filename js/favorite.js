function favoriteElementCreate(groups)
{
    const section = document.createElement("section");

    section.className = "category";
    section.id = "category-favorites";

    if (db.openCategoryId === "favorites")
    {
        section.classList.add("open");
    }

    section.appendChild(favoriteHeaderCreate());
    section.appendChild(favoritePanelCreate(groups));

    return section;
}

function favoriteHeaderCreate(){
    const btn = document.createElement("button");

    btn.className = "btn btn-header";

    btn.addEventListener("click", function(){categoryToggle("favorites");});

    const icon = document.createElement("span");
    icon.className = "star-button-catg";
    icon.textContent = "★";

    const name = document.createElement("span");
    name.className = "favorite-text";
    name.textContent = "Favoritos";

    btn.appendChild(icon);
    btn.appendChild(name);
    btn.style.backgroundColor = cb1;
    btn.style.color = "#ffffff";

    return btn;
}

function favoritePanelCreate(groups)
{
    const panel = document.createElement("div");

    panel.className = "items-panel favorites-panel";

    for (const group of groups)
    {
        favoriteGroupAdd(panel, group);
    }

    return panel;
}

function favoriteGroupAdd(panel, group)
{
    for (let i = 0; i < group.items.length; i++)
    {
        const item = group.items[i];
        const icon = i === 0 ? group.icon : "";

        panel.appendChild(favoriteRowCreate(item, icon));
    }
}

function favoriteRowCreate(item, icon)
{
    const row = document.createElement("div");

    row.className = "item-row favorite-row";
    row.id = "favorite-item-" + item.id;

    const iconBox = document.createElement("div");
    iconBox.className = "star-button";
    iconBox.textContent = icon;

    row.appendChild(iconBox);
    row.appendChild(itemNameCreate(item));
    row.appendChild(itemCheckCreate(item));

    return row;
}