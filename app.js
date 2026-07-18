const CATEGORIES = [
  { id: 1, name: "BEBIDAS", img: "n1W.svg", color: "#BE9171", order: 1 },
  { id: 2, name: "LIMPEZA", img: "n2W.svg", color: "#BE9171", order: 2 },
  { id: 3, name: "HIGIENE", img: "n3W.svg", color: "#BE9171", order: 3 },
  { id: 4, name: "UTILIDADES", img: "n4W.svg", color: "#BE9171", order: 4 },
  { id: 5, name: "LATICÍNIOS", img: "n5W.svg", color: "#BE9171", order: 5 },
  { id: 6, name: "PROTEÍNA", img: "n6W.svg", color: "#BE9171", order: 6 },
  { id: 7, name: "BÁSICO", img: "n7W.svg", color: "#BE9171", order: 7 },
  { id: 8, name: "PADARIA", img: "n8W.svg", color: "#BE9171", order: 8 },
  { id: 9, name: "HORTIFRUTI", img: "n9W.svg", color: "#BE9171", order: 9 },
  { id: 10, name: "OUTROS", img: "n10W.svg", color: "#BE9171", order: 10 },
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Suco de Uva", categoryId: 1, favorite: true, order: 1 },
  { id: 2, name: "Refrigerante", categoryId: 1, favorite: false, order: 2 },
  { id: 3, name: "Sabão em Pó", categoryId: 2, favorite: false, order: 1 },
  { id: 4, name: "Desinfetante", categoryId: 2, favorite: false, order: 2 },
  { id: 5, name: "Creme Dental", categoryId: 3, favorite: false, order: 1 },
  { id: 6, name: "Papel Higiênico", categoryId: 3, favorite: true, order: 2 },
  { id: 7, name: "Pano de Prato", categoryId: 4, favorite: false, order: 1 },
  { id: 18, name: "Pilha AAA", categoryId: 4, favorite: false, order: 2 },
  { id: 8, name: "Queijo Mussarela", categoryId: 5, favorite: true, order: 1 },
  { id: 9, name: "Iogurte Natural", categoryId: 5, favorite: false, order: 2 },
  { id: 10, name: "Frango Filé", categoryId: 6, favorite: true, order: 1 },
  { id: 11, name: "Ovos", categoryId: 6, favorite: true, order: 2 },
  { id: 12, name: "Arroz Agulhinha", categoryId: 7, favorite: true, order: 1 },
  { id: 13, name: "Feijão Preto", categoryId: 7, favorite: true, order: 2 },
  { id: 14, name: "Pão de Forma", categoryId: 8, favorite: false, order: 1 },
  { id: 15, name: "Pão Francês", categoryId: 8, favorite: true, order: 2 },
  { id: 16, name: "Banana Prata", categoryId: 9, favorite: true, order: 1 },
  { id: 17, name: "Tomate Italiano", categoryId: 9, favorite: false, order: 2 },
  { id: 19, name: "Outra Coisa", categoryId: 10, favorite: false, order: 1 },
];

const STORAGE_KEYS = {
  products: "gracie-products-v2",
  shopping: "gracie-shopping-v2",
  sortMode: "gracie-sort-mode-v2",
};

let products = [];
let shoppingProductIds = new Set();
let selectedCategoryId = CATEGORIES[0].id;
let sortMode = "category";
let openSwipeRow = null;
let voiceRecognition = null;
let voiceListening = false;
let voiceSessionActive = false;
let voiceRestartAllowed = true;
let voiceSilenceTimer = null;
let voiceStatusTimer = null;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const SWIPE_DELETE_WIDTH = 92;
const SWIPE_OPEN_THRESHOLD = 42;
const SWIPE_DIRECTION_THRESHOLD = 8;
const SWIPE_COMPLETE_MINIMUM = 92;
const SWIPE_COMPLETE_RATIO = 0.34;
const VOICE_SILENCE_LIMIT = 10000;
const VOICE_RESTART_DELAY = 250;

const elements = {
  addButton: document.getElementById("btn-add"),
  addItemForm: document.getElementById("add-item-form"),
  categoryContainer: document.getElementById("categories-container"),
  categoryTitle: document.getElementById("ctgTitle"),
  closeModalButton: document.getElementById("btn-close-modal"),
  itemModal: document.getElementById("item-modal"),
  itemNameInput: document.getElementById("input-item-name"),
  leftItemsGrid: document.getElementById("left-items-grid"),
  rightItemsGrid: document.getElementById("right-items-grid"),
  selectCategory: document.getElementById("select-category"),
  sortRadios: document.querySelectorAll('input[name="sort-mode"]'),
  tabButtons: document.querySelectorAll(".tab-btn"),
  voiceButton: document.getElementById("btn-voice"),
  voiceStatus: document.getElementById("voice-status"),
};

function databaseLoad(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return fallback;
  }
}

function databaseSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
  }
}

function productLoad() {
  const stored = databaseLoad(STORAGE_KEYS.products, null);
  products = Array.isArray(stored) ? stored : structuredClone(DEFAULT_PRODUCTS);
}

function productSave() {
  databaseSave(STORAGE_KEYS.products, products);
}

function shoppingLoad() {
  const stored = databaseLoad(STORAGE_KEYS.shopping, []);
  shoppingProductIds = new Set(Array.isArray(stored) ? stored : []);
}

function shoppingSave() {
  databaseSave(STORAGE_KEYS.shopping, [...shoppingProductIds]);
}

function shoppingToggle(productId) {
  if (shoppingProductIds.has(productId)) {
    shoppingProductIds.delete(productId);
  } else {
    shoppingProductIds.add(productId);
  }

  shoppingSave();
}

function productFavoriteToggle(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  product.favorite = !product.favorite;
  productSave();
}

function productDelete(productId) {
  products = products.filter((product) => product.id !== productId);
  shoppingProductIds.delete(productId);

  productSave();
  shoppingSave();

  swipeRowClose();
  productRender();
  shoppingRender();
}

function compareName(a, b) {
  return a.name.localeCompare(b.name, "pt-BR", {
    sensitivity: "base",
  });
}

function compareOrder(a, b) {
  return (a.order ?? 0) - (b.order ?? 0);
}

function compareCategory(a, b) {
  const categoryA = CATEGORIES.find((category) => category.id === a.categoryId);
  const categoryB = CATEGORIES.find((category) => category.id === b.categoryId);

  return (
    compareOrder(categoryA ?? { order: 0 }, categoryB ?? { order: 0 }) ||
    compareName(a, b)
  );
}

function compareFavorites(a, b) {
  return Number(b.favorite) - Number(a.favorite) || compareName(a, b);
}

function compareProducts(a, b) {
  if (sortMode === "alphabetical") {
    return compareName(a, b);
  }

  if (sortMode === "favorites") {
    return compareFavorites(a, b);
  }

  return compareCategory(a, b);
}

function categoryRender() {
  elements.categoryContainer.innerHTML = "";

  [...CATEGORIES].sort(compareOrder).forEach((category) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.className = "category-btn";
    button.title = category.name;
    button.setAttribute("aria-label", category.name);
    button.classList.toggle("active", category.id === selectedCategoryId);

    image.src = `img/${category.img}`;
    image.alt = "";

    button.appendChild(image);

    button.addEventListener("click", () => {
      swipeRowClose();
      selectedCategoryId = category.id;
      categoryRender();
      productRender();
    });

    elements.categoryContainer.appendChild(button);
  });
}

function swipeRowClose(row = openSwipeRow) {
  if (!row) {
    return;
  }

  const content = row.querySelector(".swipe-content");

  if (content) {
    content.style.transform = "translateX(0px)";
  }

  row.classList.remove("open");

  if (openSwipeRow === row) {
    openSwipeRow = null;
  }
}

function swipeRowsCloseExcept(row) {
  if (openSwipeRow && openSwipeRow !== row) {
    swipeRowClose(openSwipeRow);
  }
}


function hapticTick() {
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(10);
  }
}

function swipeCompleteCreate(card, product, onComplete) {
  const swipeRow = document.createElement("div");
  const background = document.createElement("div");
  const content = document.createElement("div");

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let currentOffset = 0;
  let gestureMode = null;
  let thresholdCrossed = false;
  let completing = false;

  swipeRow.className = "swipe-row swipe-complete-row";

  background.className = "swipe-complete-background";
  background.textContent = "Comprado";
  background.setAttribute("aria-hidden", "true");

  content.className = "swipe-content";
  content.appendChild(card);

  function thresholdGet() {
    return Math.max(
      SWIPE_COMPLETE_MINIMUM,
      swipeRow.clientWidth * SWIPE_COMPLETE_RATIO,
    );
  }

  function offsetSet(value, animate = false) {
    const width = Math.max(swipeRow.clientWidth, 1);
    currentOffset = Math.max(-width, Math.min(0, value));
    content.classList.toggle("animating", animate);
    content.style.transform = `translateX(${currentOffset}px)`;
  }

  function gestureFinish() {
    if (gestureMode === "horizontal") {
      if (Math.abs(currentOffset) >= thresholdGet()) {
        completing = true;
        swipeRow.classList.add("completing");
        content.classList.remove("animating");
        content.style.transform = `translateX(-${swipeRow.clientWidth}px)`;

        window.setTimeout(() => {
          onComplete();
        }, 180);
      } else {
        offsetSet(0, true);
      }
    }

    pointerId = null;
    gestureMode = null;
    thresholdCrossed = false;
  }

  content.addEventListener("pointerdown", (event) => {
    if (completing) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    swipeRowsCloseExcept(swipeRow);

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    currentOffset = 0;
    gestureMode = null;
    thresholdCrossed = false;

    content.classList.remove("animating");
  });

  content.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || completing) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!gestureMode) {
      if (
        Math.abs(deltaX) < SWIPE_DIRECTION_THRESHOLD &&
        Math.abs(deltaY) < SWIPE_DIRECTION_THRESHOLD
      ) {
        return;
      }

      gestureMode =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (gestureMode !== "horizontal") {
      return;
    }

    event.preventDefault();
    offsetSet(Math.min(0, deltaX));

    const crossedNow = Math.abs(currentOffset) >= thresholdGet();

    if (crossedNow && !thresholdCrossed) {
      thresholdCrossed = true;
      hapticTick();
    } else if (!crossedNow) {
      thresholdCrossed = false;
    }
  });

  content.addEventListener("pointerup", (event) => {
    if (event.pointerId === pointerId) {
      gestureFinish();
    }
  });

  content.addEventListener("pointercancel", (event) => {
    if (event.pointerId === pointerId) {
      gestureFinish();
    }
  });

  swipeRow.append(background, content);

  return swipeRow;
}

function swipeDeleteCreate(card, product, onDelete) {
  const swipeRow = document.createElement("div");
  const deleteButton = document.createElement("button");
  const content = document.createElement("div");

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let currentOffset = 0;
  let gestureMode = null;
  let suppressClick = false;
  let thresholdCrossed = false;

  swipeRow.className = "swipe-row";

  deleteButton.type = "button";
  deleteButton.className = "swipe-delete-button";
  deleteButton.textContent = "Excluir";
  deleteButton.setAttribute(
    "aria-label",
    `Excluir permanentemente ${product.name}`,
  );

  content.className = "swipe-content";
  content.appendChild(card);

  function offsetSet(value, animate = false) {
    currentOffset = Math.max(-SWIPE_DELETE_WIDTH, Math.min(0, value));
    content.classList.toggle("animating", animate);
    content.style.transform = `translateX(${currentOffset}px)`;
  }

  function gestureFinish() {
    if (gestureMode === "horizontal") {
      const shouldOpen = currentOffset <= -SWIPE_OPEN_THRESHOLD;

      if (shouldOpen) {
        swipeRowsCloseExcept(swipeRow);
        offsetSet(-SWIPE_DELETE_WIDTH, true);
        swipeRow.classList.add("open");
        openSwipeRow = swipeRow;
      } else {
        offsetSet(0, true);
        swipeRow.classList.remove("open");

        if (openSwipeRow === swipeRow) {
          openSwipeRow = null;
        }
      }

      suppressClick = true;

      window.setTimeout(() => {
        suppressClick = false;
      }, 80);
    }

    pointerId = null;
    gestureMode = null;
  }

  content.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    swipeRowsCloseExcept(swipeRow);

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startOffset = swipeRow.classList.contains("open")
      ? -SWIPE_DELETE_WIDTH
      : 0;
    currentOffset = startOffset;
    gestureMode = null;
    thresholdCrossed = false;

    content.classList.remove("animating");
  });

  content.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!gestureMode) {
      if (
        Math.abs(deltaX) < SWIPE_DIRECTION_THRESHOLD &&
        Math.abs(deltaY) < SWIPE_DIRECTION_THRESHOLD
      ) {
        return;
      }

      gestureMode =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (gestureMode !== "horizontal") {
      return;
    }

    event.preventDefault();
    offsetSet(startOffset + deltaX);

    const crossedNow = currentOffset <= -SWIPE_OPEN_THRESHOLD;

    if (crossedNow && !thresholdCrossed) {
      thresholdCrossed = true;
      hapticTick();
    } else if (!crossedNow) {
      thresholdCrossed = false;
    }
  });

  content.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    gestureFinish();
  });

  content.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    gestureFinish();
  });

  content.addEventListener(
    "click",
    (event) => {
      if (suppressClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  deleteButton.addEventListener("click", () => {
    onDelete();
  });

  swipeRow.append(deleteButton, content);

  return swipeRow;
}

function itemCardCreate(product, options = {}) {
  const {
    selected = false,
    showFavorite = false,
    deletable = false,
    swipeComplete = false,
    onRowClick,
    onFavoriteClick,
    onDelete,
    onSwipeComplete,
  } = options;

  const card = document.createElement("div");
  const rowButton = document.createElement("button");
  const name = document.createElement("span");

  card.className = "item-card";
  card.classList.toggle("selected", selected);
  card.classList.toggle("no-favorite", !showFavorite);

  rowButton.type = "button";
  rowButton.className = "item-row-button";

  name.className = "item-name";
  name.textContent = product.name;

  rowButton.appendChild(name);

  if (typeof onRowClick === "function") {
    rowButton.addEventListener("click", onRowClick);
  }

  card.appendChild(rowButton);

  if (showFavorite) {
    const favoriteButton = document.createElement("button");

    favoriteButton.type = "button";
    favoriteButton.className = "favorite-button";
    favoriteButton.classList.toggle("active", Boolean(product.favorite));
    favoriteButton.textContent = product.favorite ? "★" : "☆";
    favoriteButton.setAttribute(
      "aria-label",
      product.favorite
        ? `Remover ${product.name} dos favoritos`
        : `Adicionar ${product.name} aos favoritos`,
    );

    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      onFavoriteClick();
    });

    card.insertBefore(favoriteButton, rowButton);
  }

  if (deletable) {
    return swipeDeleteCreate(card, product, onDelete);
  }

  if (swipeComplete) {
    return swipeCompleteCreate(card, product, onSwipeComplete);
  }

  return card;
}

function productRender() {
  elements.leftItemsGrid.innerHTML = "";

  const category = CATEGORIES.find(
    (item) => item.id === selectedCategoryId,
  );

  elements.categoryTitle.textContent = category?.name ?? "";

  const categoryProducts = products
    .filter((product) => product.categoryId === selectedCategoryId)
    .sort(compareName);

  if (categoryProducts.length === 0) {
    elements.leftItemsGrid.innerHTML =
      '<div class="empty-state">Nenhum item nesta categoria.</div>';
    return;
  }

  categoryProducts.forEach((product) => {
    const card = itemCardCreate(product, {
      selected: shoppingProductIds.has(product.id),
      showFavorite: true,
      deletable: true,
      onDelete: () => {
        productDelete(product.id);
      },
      onRowClick: () => {
        shoppingToggle(product.id);
        productRender();
        shoppingRender();
      },
      onFavoriteClick: () => {
        productFavoriteToggle(product.id);
        productRender();

        if (document.getElementById("right-panel").classList.contains("active")) {
          shoppingRender();
        }
      },
    });

    elements.leftItemsGrid.appendChild(card);
  });
}

function shoppingRender() {
  elements.rightItemsGrid.innerHTML = "";

  const shoppingProducts = products
    .filter((product) => shoppingProductIds.has(product.id))
    .sort(compareProducts);

  if (shoppingProducts.length === 0) {
    elements.rightItemsGrid.innerHTML =
      '<div class="empty-state">A lista de compras está vazia.</div>';
    return;
  }

  shoppingProducts.forEach((product) => {
    const card = itemCardCreate(product, {
      showFavorite: false,
      swipeComplete: true,
      onSwipeComplete: () => {
        shoppingProductIds.delete(product.id);
        shoppingSave();
        shoppingRender();
        productRender();
      },
    });

    elements.rightItemsGrid.appendChild(card);
  });
}


function textNormalize(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function voiceStatusShow(message, type = "") {
  window.clearTimeout(voiceStatusTimer);

  elements.voiceStatus.textContent = message;
  elements.voiceStatus.className = `voice-status ${type}`.trim();
  elements.voiceStatus.hidden = false;

  voiceStatusTimer = window.setTimeout(() => {
    elements.voiceStatus.hidden = true;
  }, 3200);
}

function voiceProductMatches(searchText) {
  const normalizedSearch = textNormalize(searchText);

  if (!normalizedSearch) {
    return [];
  }

  const exactMatches = products.filter(
    (product) => textNormalize(product.name) === normalizedSearch,
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  return products.filter((product) => {
    const normalizedName = textNormalize(product.name);

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedName)
    );
  });
}

function voiceProductAction(action, spokenName) {
  const matches = voiceProductMatches(spokenName);

  if (matches.length === 0) {
    voiceStatusShow(`Não encontrei "${spokenName}".`, "error");
    return;
  }

  if (matches.length > 1) {
    voiceStatusShow(
      `Encontrei mais de um item com "${spokenName}".`,
      "error",
    );
    return;
  }

  const product = matches[0];

  if (action === "add") {
    if (shoppingProductIds.has(product.id)) {
      voiceStatusShow(`${product.name} já está em Compras.`);
      return;
    }

    shoppingProductIds.add(product.id);
    shoppingSave();
    productRender();
    shoppingRender();
    voiceStatusShow(`${product.name} adicionado.`, "success");
    return;
  }

  if (!shoppingProductIds.has(product.id)) {
    voiceStatusShow(`${product.name} não está em Compras.`);
    return;
  }

  shoppingProductIds.delete(product.id);
  shoppingSave();
  productRender();
  shoppingRender();
  voiceStatusShow(`${product.name} removido.`, "success");
}

function voiceCommandProcess(transcript) {
  const command = textNormalize(transcript);

  if (!command) {
    voiceStatusShow("Não entendi o comando.", "error");
    return;
  }

  const openListCommands = new Set([
    "abrir lista",
    "mostrar lista",
    "ir para lista",
    "lista",
  ]);

  const openShoppingCommands = new Set([
    "abrir compras",
    "mostrar compras",
    "ir para compras",
    "compras",
  ]);

  if (openListCommands.has(command)) {
    panelShow("left-panel");
    voiceStatusShow("Lista aberta.", "success");
    return;
  }

  if (openShoppingCommands.has(command)) {
    panelShow("right-panel");
    voiceStatusShow("Compras aberta.", "success");
    return;
  }

  const commandGroups = [
    {
      action: "add",
      prefixes: [
        "adicionar ",
        "adicione ",
        "incluir ",
        "inclua ",
        "colocar ",
        "coloque ",
        "comprar ",
      ],
    },
    {
      action: "remove",
      prefixes: [
        "remover ",
        "remova ",
        "tirar ",
        "tire ",
        "retirar ",
        "retire ",
      ],
    },
  ];

  for (const group of commandGroups) {
    const prefix = group.prefixes.find((item) => command.startsWith(item));

    if (prefix) {
      voiceProductAction(group.action, command.slice(prefix.length).trim());
      return;
    }
  }

  voiceStatusShow(
    `Comando não reconhecido: "${transcript}".`,
    "error",
  );
}

function voiceSilenceReset() {
  window.clearTimeout(voiceSilenceTimer);

  if (!voiceSessionActive) {
    return;
  }

  voiceSilenceTimer = window.setTimeout(() => {
    voiceSessionStop("Microfone desligado após 10 segundos de silêncio.");
  }, VOICE_SILENCE_LIMIT);
}

function voiceSessionStop(message = "Microfone desligado.") {
  voiceSessionActive = false;
  voiceRestartAllowed = false;
  window.clearTimeout(voiceSilenceTimer);

  if (voiceRecognition && voiceListening) {
    voiceRecognition.stop();
  }

  voiceListening = false;
  elements.voiceButton.classList.remove("listening");
  elements.voiceButton.setAttribute("aria-label", "Usar comando de voz");

  if (message) {
    voiceStatusShow(message);
  }
}

function voiceRecognitionStart() {
  if (!voiceSessionActive || voiceListening || !voiceRecognition) {
    return;
  }

  try {
    voiceRecognition.start();
  } catch (error) {
    if (error.name !== "InvalidStateError") {
      console.error("Erro ao reiniciar reconhecimento de voz:", error);
      voiceSessionStop("Não consegui manter o microfone ativo.");
    }
  }
}

function voiceRecognitionSetup() {
  if (!SpeechRecognition) {
    elements.voiceButton.title = "Verificar reconhecimento de voz";
    return;
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = "pt-BR";
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;

  voiceRecognition.addEventListener("start", () => {
    voiceListening = true;
    elements.voiceButton.classList.add("listening");
    elements.voiceButton.setAttribute("aria-label", "Desligar comando de voz");

    if (voiceSessionActive) {
      voiceStatusShow("Estou ouvindo…");
      voiceSilenceReset();
    }
  });

  voiceRecognition.addEventListener("speechstart", () => {
    voiceSilenceReset();
  });

  voiceRecognition.addEventListener("result", (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    voiceCommandProcess(transcript);
    voiceSilenceReset();
  });

  voiceRecognition.addEventListener("error", (event) => {
    const messages = {
      "audio-capture": "Não consegui acessar o microfone.",
      "not-allowed": "Permissão do microfone não concedida.",
      "service-not-allowed": "O serviço de reconhecimento de voz foi bloqueado.",
      network: "Falha de conexão no reconhecimento de voz.",
    };

    if (event.error === "no-speech" || event.error === "aborted") {
      return;
    }

    voiceRestartAllowed = false;
    voiceStatusShow(
      messages[event.error] ?? "Não foi possível reconhecer o comando.",
      "error",
    );
  });

  voiceRecognition.addEventListener("end", () => {
    voiceListening = false;

    if (voiceSessionActive && voiceRestartAllowed) {
      window.setTimeout(voiceRecognitionStart, VOICE_RESTART_DELAY);
      return;
    }

    if (voiceSessionActive && !voiceRestartAllowed) {
      voiceSessionStop("");
      return;
    }

    elements.voiceButton.classList.remove("listening");
    elements.voiceButton.setAttribute("aria-label", "Usar comando de voz");
  });
}

async function microphonePermissionEnsure() {
  if (!window.isSecureContext) {
    throw new Error("insecure-context");
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("microphone-api-unavailable");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

async function voiceToggle() {
  if (!SpeechRecognition || !voiceRecognition) {
    voiceStatusShow(
      "Este navegador não oferece reconhecimento de voz. Abra o Gracie diretamente no Safari para testar.",
      "error",
    );
    return;
  }

  if (voiceSessionActive) {
    voiceSessionStop();
    return;
  }

  elements.voiceButton.disabled = true;
  voiceStatusShow("Preparando o microfone…");

  try {
    await microphonePermissionEnsure();
    voiceSessionActive = true;
    voiceRestartAllowed = true;
    voiceSilenceReset();
    voiceRecognitionStart();
  } catch (error) {
    console.error("Erro ao iniciar reconhecimento de voz:", error);

    const messages = {
      "NotAllowedError": "Permissão do microfone não concedida. Autorize o microfone para este site nos ajustes do Safari.",
      "NotFoundError": "Nenhum microfone foi encontrado.",
      "NotReadableError": "O microfone está sendo usado por outro aplicativo.",
      "AbortError": "O acesso ao microfone foi interrompido.",
      "insecure-context": "O microfone exige uma conexão HTTPS.",
      "microphone-api-unavailable": "O acesso ao microfone não está disponível neste navegador.",
    };

    voiceStatusShow(
      messages[error.name] ?? messages[error.message] ??
        `Não consegui acessar o microfone (${error.name || "erro desconhecido"}).`,
      "error",
    );
  } finally {
    elements.voiceButton.disabled = false;
  }
}

function panelShow(panelId) {
  swipeRowClose();

  document.querySelectorAll(".panel").forEach((panel) => {
    const active = panel.id === panelId;

    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  elements.tabButtons.forEach((button) => {
    const active = button.dataset.panel === panelId;

    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (panelId === "right-panel") {
    shoppingRender();
  }
}

function sortModeLoad() {
  const savedMode = databaseLoad(STORAGE_KEYS.sortMode, "category");
  const validModes = new Set(["category", "alphabetical", "favorites"]);

  sortMode = validModes.has(savedMode) ? savedMode : "category";

  elements.sortRadios.forEach((radio) => {
    radio.checked = radio.value === sortMode;
  });
}

function modalCategoryOptionsRender() {
  elements.selectCategory.innerHTML = "";

  [...CATEGORIES].sort(compareOrder).forEach((category) => {
    const option = document.createElement("option");

    option.value = String(category.id);
    option.textContent = category.name;

    elements.selectCategory.appendChild(option);
  });

  elements.selectCategory.value = String(selectedCategoryId);
}

function modalOpen() {
  modalCategoryOptionsRender();
  elements.itemModal.showModal();

  requestAnimationFrame(() => {
    elements.itemNameInput.focus();
  });
}

function modalClose() {
  elements.itemModal.close();
  elements.addItemForm.reset();
}

document.addEventListener("pointerdown", (event) => {
  if (openSwipeRow && !openSwipeRow.contains(event.target)) {
    swipeRowClose();
  }
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    panelShow(button.dataset.panel);
  });
});

elements.sortRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!radio.checked) {
      return;
    }

    sortMode = radio.value;
    databaseSave(STORAGE_KEYS.sortMode, sortMode);
    shoppingRender();
  });
});

elements.voiceButton.addEventListener("click", voiceToggle);
elements.addButton.addEventListener("click", modalOpen);
elements.closeModalButton.addEventListener("click", modalClose);

elements.addItemForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = elements.itemNameInput.value.trim();
  const categoryId = Number(elements.selectCategory.value);

  if (!name || !Number.isInteger(categoryId)) {
    return;
  }

  const categoryProducts = products.filter(
    (product) => product.categoryId === categoryId,
  );

  products.push({
    id: Date.now(),
    name,
    categoryId,
    favorite: false,
    order: categoryProducts.length + 1,
  });

  productSave();
  selectedCategoryId = categoryId;

  modalClose();
  categoryRender();
  productRender();
});

elements.itemModal.addEventListener("click", (event) => {
  if (event.target === elements.itemModal) {
    modalClose();
  }
});

productLoad();
shoppingLoad();
voiceRecognitionSetup();
sortModeLoad();
categoryRender();
productRender();
shoppingRender();
panelShow("left-panel");
