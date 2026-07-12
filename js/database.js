
const cb1 = "#0991f3";
const cb2 = "#f8a648";
const cb3 = "#969dab";

const db = {
  categories: [
    {
      id: 1,
      name: "Hortifruti",
      icon: "img/1.png",
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
        { id: 302, name: "Mussarela", favorite: true, selected: false, cost: 0 },
        { id: 303, name: "Iogurte", favorite: false, selected: false, cost: 0 },
        { id: 304, name: "Manteiga", favorite: false, selected: false, cost: 0 },
        { id: 305, name: "Requeijão", favorite: false, selected: false, cost: 0 },
        { id: 306, name: "Presunto", favorite: false, selected: false, cost: 0 },
        { id: 307, name: "Bacon", favorite: false, selected: false, cost: 0 },
        { id: 308, name: "Salsicha", favorite: false, selected: false, cost: 0 },
        { id: 309, name: "Salame", favorite: false, selected: false, cost: 0 },
        { id: 310, name: "Lombinho", favorite: false, selected: false, cost: 0 },
        { id: 312, name: "Linguiça Blumenau", favorite: true, selected: false, cost: 0 },
        { id: 313, name: "Linguiça Calabresa", favorite: true, selected: false, cost: 0 },
        { id: 314, name: "Prosciutto", favorite: true, selected: false, cost: 0 },
        { id: 315, name: "Creme de Leite", favorite: true, selected: false, cost: 0 },

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
        { id: 701, name: "Escova de Dentes", favorite: false, selected: false, cost: 0 },
      ],
    },

    {
      id: 8,
      name: "Limpeza",
      icon: "img/esponja.png",
      color: cb3,
      position: 8,
      items: [
        { id: 801, name: "Omo",      favorite: false, selected: false, cost: 0 },
        { id: 802, name: "Parmesão", favorite: false, selected: false, cost: 0 },
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
