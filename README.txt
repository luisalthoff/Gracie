GRACIE V3 — SWIPE TO DELETE

Files included:
- index.html
- style.css
- app.js
- README.txt
- ARCHITECTURE.md

Keep your existing img/ folder beside these files.

NEW IN THIS VERSION
- Swipe a product row to the left on the Lista tab.
- A red Excluir button appears.
- Tap Excluir to permanently delete the product.
- The product is also removed from Compras if it was selected.
- Only one row can remain open.
- Tapping outside closes the open row.
- Vertical scrolling remains available.
- No delete confirmation modal.

UNCHANGED
- Favorite star appears only on Lista.
- Tapping the star changes favorite.
- Tapping the row adds/removes the product from Compras.
- Shopping sorting: Categoria, A–Z, Favoritos.
- Data remains stored in localStorage.

TEST ON IPHONE
1. Open Lista.
2. Swipe one product left.
3. Confirm that vertical scrolling still works normally.
4. Confirm that a short accidental movement does not expose Excluir.
5. Open one row, then open another; the first should close.
6. Delete a product that is also in Compras.
7. Confirm that it disappears from both places.


V3.1 FIX
- Removed pointer capture from swipe rows because it could suppress item taps
  in iPhone Safari.
- Removed an accidentally duplicated outside-tap listener.
- The shopping panel is refreshed immediately after selecting an item.


V4 — SWIPE PURCHASE + VOICE
- Compras: tapping an item no longer removes it.
- Compras: swipe left past the threshold to mark it purchased immediately.
- Lista: swipe left still reveals Excluir and requires a tap.
- A subtle haptic tick is requested when the swipe threshold is crossed.
  Unsupported browsers simply ignore it.
- Voice button added.
- Portuguese commands:
  adicionar <item>
  remover <item>
  abrir lista
  abrir compras
- Voice searches the complete catalog, regardless of the selected category.
- Ambiguous product matches are never guessed.
