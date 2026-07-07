appInit();

function appInit() {
    storageLoad();
    databaseValidate();

    //databaseSortCategories();
    databaseSortItems();

    screenDraw();
}
