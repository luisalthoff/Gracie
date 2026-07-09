/*

const CORES = {
    p1: [ "#fcf6bd", "#ff99c8", "#d0f4de", "#a9def9", "#e4c1f9", "#D6CCC2" ],
    p2: [ "#f79256", "#fbd1a2", "#7dcfb6", "#00b2ca", "#1d4e89", "#D6CCC2" ],
    p3: [ "#d8f3dc", "#b7e4c7", "#95d5b2", "#74c69d", "#52b788", "#40916c", "#2d6a4f", "#1b4332", "#081c15" ],
    p4: [ "#969dab", "#49aef8", "#4395fd", "#f7b94a", "#f8a648", "#bdc2ca", "#8dcdfa", "#8abdfe", "#fad38e", "#fbc88d"],
} 


const cP = CORES.p4;
*/
const cb1 = "#0991f3";
const cb2 = "#f8a648";
const cb3 = "#969dab";

const db = {
  categories: [
    {
      id: 1,
      name: "Hortifruti",
      icon: "img/banana.png",
      color: cb1,
      position: 1,
      items: [
        { id: 101, name: "Banana", favorite: false, selected: false, cost: 0 },
        { id: 102, name: "Maçã", favorite: true, selected: false, cost: 0 },
        { id: 103, name: "Cenoura", favorite: false, selected: false, cost: 0 },
        { id: 104, name: "Alface", favorite: false, selected: false, cost: 0 },
        { id: 105, name: "Tomate", favorite: true, selected: false, cost: 0 },
        { id: 106, name: "Laranja", favorite: false, selected: false, cost: 0 },
      ],
    },
    {
      id: 2,
      name: "Açougue",
      icon: "img/carne.png",
      color: cb2,
      position: 2,
      items: [
        { id: 201, name: "Carne Moída", favorite: false, selected: false, cost: 0 },
        { id: 202, name: "Frango Congelado", favorite: false, selected: false, cost: 0 },
        { id: 203, name: "Atum em Lata", favorite: true, selected: false, cost: 0 },
      ],
    },
    {
      id: 3,
      name: "Frios & Laticínios",
      icon: "img/queijo.png",
      color: cb3,
      position: 3,
      items: [
        { id: 301, name: "Leite Ninho", favorite: false, selected: true },
        { id: 302, name: "Queijo", favorite: true, selected: false, cost: 0 },
        { id: 303, name: "Iogurte", favorite: false, selected: false, cost: 0 },
        { id: 304, name: "Manteiga", favorite: false, selected: false, cost: 0 },
        { id: 305, name: "Requeijão", favorite: false, selected: false, cost: 0 },
        { id: 306, name: "Presunto", favorite: false, selected: false, cost: 0 },
        { id: 307, name: "Bacon", favorite: false, selected: false, cost: 0 },
        { id: 308, name: "Salsicha", favorite: false, selected: false, cost: 0 },
        { id: 309, name: "Salame", favorite: false, selected: false, cost: 0 },
        { id: 310, name: "Lombinho", favorite: false, selected: false, cost: 0 },
        {
          id: 311,
          name: "Camarão Congelado",
          favorite: false,
          selected: false,
        },
      ],
    },

    {
      id: 4,
      name: "Produtos Básicos",
      icon: "img/arroz.png",
      color: cb3,
      position: 4,
      items: [
        { id: 401, name: "Arroz", favorite: false, selected: false, cost: 0 },
        { id: 402, name: "Feijão", favorite: false, selected: false, cost: 0 },
        { id: 403, name: "Farinha", favorite: true, selected: false, cost: 0 },
        { id: 404, name: "Amendoim", favorite: true, selected: false, cost: 0 },
        { id: 405, name: "Milho", favorite: true, selected: false, cost: 0 },
      ],
    },

    {
      id: 5,
      name: "Padaria",
      icon: "img/pao.png",
      color: cb3,
      position: 5,
      items: [
        { id: 501, name: "Pão da Márcia", favorite: false, selected: false, cost: 0 },
        { id: 502, name: "Granola", favorite: false, selected: false, cost: 0 },
        { id: 503, name: "Pão de Queijo", favorite: true, selected: false, cost: 0 },
        {
          id: 504,
          name: "Fermento Biológico",
          favorite: true,
          selected: false,
        },
        { id: 505, name: "Fermento Químico", favorite: true, selected: false, cost: 0 },
      ],
    },
    {
      id: 6,
      name: "Bebidas",
      icon: "img/bebida.png",
      color: cb3,
      position: 6,
      items: [
        { id: 601, name: "Água", favorite: false, selected: false, cost: 0 },
        { id: 602, name: "Suco", favorite: false, selected: false, cost: 0 },
        { id: 603, name: "Café", favorite: true, selected: false, cost: 0 },
        { id: 604, name: "Coca Zero", favorite: true, selected: false, cost: 0 },
        { id: 605, name: "Absolut", favorite: true, selected: false, cost: 0 },
        { id: 606, name: "Cerveja", favorite: true, selected: false, cost: 0 },
        { id: 607, name: "Vinho", favorite: true, selected: false, cost: 0 },
      ],
    },
    {
      id: 7,
      name: "Higiene",
      icon: "img/ph.png",
      color: cb3,
      position: 7,
      items: [
        { id: 701, name: "Escova de Dente", favorite: false, selected: false, cost: 0 },
      ],
    },
    {
      id: 8,
      name: "Limpeza",
      icon: "img/esponja.png",
      color: cb3,
      position: 8,
      items: [
        { id: 801, name: "Omo", favorite: false, selected: false, cost: 0 },
      ],
    },
  ],
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
}

function databaseFindFavoriteItems()
{
    const favorites = [];

    for (const category of db.categories)
    {
        for (const item of category.items)
        {
            if (item.favorite)
            {
                favorites.push(
                {
                    ...item,
                    categoryName: category.name
                });
            }
        }
    }

    favorites.sort(function(a, b)
    {
        const categoryCompare = a.categoryName.localeCompare(b.categoryName);

        if (categoryCompare !== 0)
        {
            return categoryCompare;
        }

        return a.name.localeCompare(b.name);
    });

    return favorites;
}

function databaseFindFavoriteGroups()
{
    const groups = [];

    for (const category of db.categories)
    {
        const favoriteItems = [];

        for (const item of category.items)
        {
            if (item.favorite)
            {
                favoriteItems.push(item);
            }
        }

        if (favoriteItems.length > 0)
        {
            favoriteItems.sort(databaseSortText);

            groups.push(
            {
                categoryId: category.id,
                categoryName: category.name,
                icon: category.icon,
                items: favoriteItems
            });
        }
    }

    groups.sort(function(a, b)
    {
        return a.categoryName.localeCompare(b.categoryName);
    });

    return groups;
}

function databaseSortCategories()
{
    db.categories.sort(sortByOrder);
}

function databaseSortItems()
{
    for (const category of db.categories)
    {
        category.items.sort(sortByName);
    }
}