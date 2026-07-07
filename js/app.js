appInit();
storageReset();

function appInit() {
    storageLoad();
    databaseValidate();

    //databaseSortCategories();
    databaseSortItems();

    screenDraw();
}
