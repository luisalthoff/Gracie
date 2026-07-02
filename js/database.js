const db = {
  openCategoryId: 3,

  categories: [
    {
      id: 1,
      name: "Frutas",
      icon: "🍎",
      items: [
        { id: 101, name: "Apple", favorite: false, selected: false },
        { id: 102, name: "Banana", favorite: true, selected: false },
        { id: 103, name: "Orange", favorite: false, selected: false }
      ]
    },

    {
      id: 2,
      name: "Vegetables",
      icon: "🥕",
      items: [
        { id: 201, name: "Carrot", favorite: false, selected: false },
        { id: 202, name: "Lettuce", favorite: false, selected: false },
        { id: 203, name: "Tomato", favorite: true, selected: false }
      ]
    },

    {
      id: 3,
      name: "Dairy",
      icon: "🥛",
      items: [
        { id: 301, name: "Milk", favorite: false, selected: true },
        { id: 302, name: "Cheese", favorite: true, selected: false },
        { id: 303, name: "Yogurt", favorite: false, selected: false },
        { id: 304, name: "Butter", favorite: false, selected: false },
        { id: 305, name: "Eggs", favorite: true, selected: true },
        { id: 306, name: "Cream", favorite: false, selected: false },
        { id: 307, name: "Sour Cream", favorite: false, selected: false }
      ]
    },

    {
      id: 4,
      name: "Drinks",
      icon: "🥤",
      items: [
        { id: 401, name: "Water", favorite: false, selected: false },
        { id: 402, name: "Juice", favorite: false, selected: false },
        { id: 403, name: "Coffee", favorite: true, selected: false }
      ]
    }
  ]
};


// ============== DB FUNCTIONS ==================//

function databaseFindCategory(categoryId)
{
    for (const category of db.categories)
    {
        if (category.id === categoryId)
        {
            return category;
        }
    }

    console.error("Category not found:", categoryId);
    return null;
}

function databaseFindItem(itemId)
{
    for (const category of db.categories)
    {
        for (const item of category.items)
        {
            if (item.id === itemId)
            {
                return item;
            }
        }
    }

    console.error("Item not found:", itemId);
    return null;
}

function databaseValidate()
{
    if (!db.categories)
    {
        db.categories = [];
    }

    if (db.openCategoryId === undefined)
    {
        db.openCategoryId = null;
    }
}