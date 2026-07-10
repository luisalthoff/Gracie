appInit();
console.log("inicio");
function appInit()
{
    console.log("inicio dentro funcao");
    storageLoad();
    databaseValidate();

    //databaseSortCategories();
    databaseSortItems();
    screenDraw();
}
