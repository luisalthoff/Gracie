appInit();

function appInit()
{
    console.log("inicio dentro funcao");
    storageLoad();
    databaseValidate();

    sortItems();
    screenDraw();
}
