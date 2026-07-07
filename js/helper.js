function elementGet(id)
{
    return document.getElementById(id);
}

function elementClear(element)
{
    element.replaceChildren();
}

function valueIsEmpty(value)
{
    return value === null ||
           value === undefined ||
           value === "";
}

function idGenerate()
{
    return Date.now();
}

function databaseSortText(a, b)
{
    return a.name.localeCompare(b.name);
}

function databaseSortCategories()
{
    db.categories.sort(databaseSortText);
}

function databaseSortItems()
{
    for (const category of db.categories)
    {
        category.items.sort(databaseSortText);
    }
}

function sortByName(a, b)
{
    return a.name.localeCompare(b.name);
}

function sortByOrder(a, b)
{
    return a.order - b.order;
}

