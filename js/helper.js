

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

function sortItems()
{
    for (const category of db.categories)
    {
        category.items.sort(sortByName);
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

