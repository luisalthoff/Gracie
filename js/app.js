appInit();

function appInit()
{
    storageLoad();
    databaseValidate();

    sortItems();
    screenDraw();
}
