function elementGet(id)
{
    return document.getElementById(id);
}

function elementCreate(type)
{
    return document.createElement(type);
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