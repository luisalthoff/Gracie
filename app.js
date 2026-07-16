// Unique SVG paths customized for each distinct category structure
const colors = [ "", "#A3B5B2", "#B67F64", "#AAAC8C", "#D3BC99", "#3D4E5E", "#AA9CA4", "#BD924F", "#9C8A74", "#8F5233", "#5C3740" ];
const CATEGORIES = [
  { 
    id: 1,
    name: "BEBIDAS",
    color: colors[1],
    img: "n1.png"
  },
  { 
    id: 2, 
    name: "LIMPEZA", 
    color: colors[2],
    img: "n2.png"
  },
  { 
    id: 3, 
    name: "HIGIENE", 
    color: colors[3],
    img: "n3.png"
  },
  { 
    id: 4, 
    name: "UTILIDADES",
    color: colors[4],
    img: "n4.png"
  },
  { 
    id: 5, 
    name: "LATICÍNIOS",
    color: colors[5],
    img: "n5.png"
  },
  { 
    id: 6, 
    name: "PROTEÍNA",
    color: colors[6],
    img: "n6.png"
  },
  { 
    id: 7, 
    name: "BÁSICO",
    color: colors[7],
    img: "n7.png"
  },
  { 
    id: 8, 
    name: "PADARIA", 
    color: colors[8],
    img: "n8.png"
  },
  { 
    id: 9, 
    name: "HORTIFRUTI",
    color: colors[9],
    img: "n9.png"
  },
  { 
    id: 10,
     name: "OUTROS", 
     color: colors[10],
    img: "n10.png"
  }
];

let catalogItems = [
  { id: 1, name: "Suco de Uva", category_id: 1 },
  { id: 2, name: "Refrigerante", category_id: 1 },
  { id: 3, name: "Sabão em Pó", category_id: 2 },
  { id: 4, name: "Desinfetante", category_id: 2 },
  { id: 5, name: "Creme Dental", category_id: 3 },
  { id: 6, name: "Papel Higiênico", category_id: 3 },
  { id: 7, name: "Pano de Prato", category_id: 4 },
  { id: 18, name: "Pilha AAA", category_id: 4 },
  { id: 8, name: "Queijo Mussarela", category_id: 5 },
  { id: 9, name: "Iogurte Natural", category_id: 5 },
  { id: 10, name: "Frango Filé", category_id: 6 },
  { id: 11, name: "Ovos", category_id: 6 },
  { id: 12, name: "Arroz Agulhinha", category_id: 7 },
  { id: 13, name: "Feijão Preto", category_id: 7 },
  { id: 14, name: "Pão de Forma", category_id: 8 },
  { id: 15, name: "Pão Francês", category_id: 8 },
  { id: 16, name: "Banana Prata", category_id: 9 },
  { id: 17, name: "Tomate Italiano", category_id: 9 },
  { id: 19, name: "outra coisa", category_id: 10 },
];

class RelationalShoppingDB {
  constructor(dbName = 'split_screen_grocery_db') {
    this.dbName = dbName;
    if (!localStorage.getItem(this.dbName)) {
      localStorage.setItem(this.dbName, JSON.stringify({ shopping_list: [] }));
    }
  }
  _readRaw() { return JSON.parse(localStorage.getItem(this.dbName)); }
  _saveRaw(data) { localStorage.setItem(this.dbName, JSON.stringify(data)); }
  getShoppingList() { return this._readRaw().shopping_list || []; }
  insertIntoShoppingList(item) {
    const db = this._readRaw();
    if (db.shopping_list.find(i => i.item_id === item.id)) return;
    db.shopping_list.push({ id: Date.now(), item_id: item.id, name: item.name, category_id: item.category_id });
    this._saveRaw(db);
  }
  deleteFromShoppingList(transactionId) {
    const db = this._readRaw();
    db.shopping_list = db.shopping_list.filter(i => i.id !== transactionId);
    this._saveRaw(db);
  }
}

const db = new RelationalShoppingDB();
let selectedCategoryId = null;

const ctgCntnr = document.getElementById('categories-container');
const leftItemsGrid = document.getElementById('left-items-grid');
const rightItemsGrid = document.getElementById('right-items-grid');
const sortToggle = document.getElementById('sort-toggle');
const ctgTitle = document.getElementById('ctgTitle');
const itemModal = document.getElementById('item-modal');
const addItemForm = document.getElementById('add-item-form');
const selectCategory = document.getElementById('select-category');


// ============================================



function initCategories() {
  ctgCntnr.innerHTML = '';

  CATEGORIES.forEach(cat =>
  {
    const btn = document.createElement('button');
    const img = document.createElement('img');
    btn.className = 'category-btn';
    
    btn.style.background = cat.color; //`linear-gradient( 135deg, ${cor1} 0%, ${cor2} 100%)`;
    img.src = `img/${cat.img}`;
    img.className = "category-img"
    btn.appendChild(img);
    
    //btn.title = cat.name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategoryId = cat.id;
      ctgTitle.textContent = cat.name;
      renderLeftPanel();
    });
    ctgCntnr.appendChild(btn);
  });
}




// =============================================




function renderLeftPanel() {
  leftItemsGrid.innerHTML = '';
  if (!selectedCategoryId) return;
  const filteredItems = catalogItems.filter(item => item.category_id === selectedCategoryId);
  const catDef = CATEGORIES.find(c => c.id === selectedCategoryId);
  
  if (filteredItems.length === 0) {
    leftItemsGrid.innerHTML = `<div class="empty-state">Nenhum item nesta categoria. Clique no "+" acima para criar!</div>`;
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.backgroundColor = catDef.color;
    card.innerHTML = `<div class="item-left-content"><span class="favorite-star">★</span><span>${item.name}</span></div>`;
    
    card.addEventListener('click', () => { db.insertIntoShoppingList(item); renderRightPanel(); });
    leftItemsGrid.appendChild(card);
  });
}

function renderRightPanel() {
  rightItemsGrid.innerHTML = '';
  let list = db.getShoppingList();
  if (list.length === 0) {
    rightItemsGrid.innerHTML = `<div class="empty-state">Lista vazia. Clique nos favoritos à esquerda!</div>`;
    return;
  }
  sortToggle.checked ? list.sort((a,b) => a.name.localeCompare(b.name)) : list.sort((a,b) => a.category_id - b.category_id);
  list.forEach(item => {
    const catDef = CATEGORIES.find(c => c.id === item.category_id) || { color: '#fff' };
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.backgroundColor = catDef.color;
    card.innerHTML = `<div class="item-left-content"><span>${item.name}</span></div>`;
    
    card.addEventListener('click', () => { db.deleteFromShoppingList(item.id); renderRightPanel(); });
    rightItemsGrid.appendChild(card);
  });
}

document.getElementById('btn-add').addEventListener('click', () => {
  selectCategory.innerHTML = '';
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.name;
    selectCategory.appendChild(opt);
  });
  itemModal.showModal();
  document.getElementById('input-item-name').focus();
});

const closeForm = () => { itemModal.close(); addItemForm.reset(); };
document.getElementById('btn-close-modal').addEventListener('click', closeForm);

addItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('input-item-name').value.trim();
  const catId = parseInt(selectCategory.value, 10);
  const newItem = { id: Date.now(), name: name, category_id: catId };
  
  catalogItems.push(newItem);
  closeForm();
  
  if (selectedCategoryId === catId) { renderLeftPanel(); }
});

// Drag Split Screen - Modified boundary snap limits from 10% to 90%
// Drag Split Screen - Fully Compatible with Desktop Mouse and iPhone Touch
const leftPanel = document.getElementById('left-panel');
const divider = document.getElementById('split-divider');
const container = document.getElementById('list-container');
let isDragging = false;

// 1. Listen for standard pointer initialization (handles mousedown and touchstart)
divider.addEventListener('pointerdown', (e) => { 
  isDragging = true; 
  divider.classList.add('dragging'); 
  document.body.style.cursor = 'col-resize';
  
  // Prevents text selection ghosting on iOS safari
  e.preventDefault(); 
});

// 2. Track movements seamlessly across touch and mouse events
document.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  
  const rect = container.getBoundingClientRect();
  
  // Unified pointer tracking calculation
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  
  // Boundary snap limits
  if (pct < 10) pct = 10;
  if (pct > 90) pct = 90;
  
  leftPanel.style.width = `${pct}%`;
});

// 3. Reset state on drag termination
document.addEventListener('pointerup', () => { 
  if (isDragging) { 
    isDragging = false; 
    divider.classList.remove('dragging'); 
    document.body.style.cursor = 'default'; 
  } 
});

// Safety fallbacks to ensure dragging releases if cursor departs the screen window
document.addEventListener('pointercancel', () => {
  if (isDragging) {
    isDragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = 'default';
  }
});

sortToggle.addEventListener('change', renderRightPanel);
initCategories();
renderRightPanel();






