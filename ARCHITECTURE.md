# Gracie Architecture

## Product principle

**Beautiful. Fast. Simple.**

Every screen has one primary purpose:

- **Lista:** build the shopping list.
- **Compras:** remove products as they are purchased.

## Data

### Category

```javascript
{
  id,
  name,
  img,
  color,
  order
}
```

### Product

```javascript
{
  id,
  categoryId,
  name,
  favorite,
  order
}
```

### Shopping list

The shopping list stores only product IDs.

```javascript
Set<productId>
```

Product names, categories, and favorites are never duplicated in the shopping list.

## Interaction rules

- Tapping a product row toggles its presence in the shopping list.
- Tapping the star toggles favorite independently.
- Favorites are shown only on **Lista**.
- Swipe left on **Lista** reveals the permanent delete action.
- Permanent deletion uses two deliberate actions: swipe, then tap **Excluir**.
- No confirmation modal is required.
- Deleting a product also removes its ID from the shopping list.
- Only one swipe row may remain open.

## Rendering rules

Render functions draw the current state. Persistent state changes belong in dedicated functions.

```javascript
categoryRender();
productRender();
shoppingRender();
```

## Naming

Use clear domain prefixes and consistent verbs.

```javascript
databaseLoad();
databaseSave();

productLoad();
productSave();
productDelete();
productFavoriteToggle();

shoppingLoad();
shoppingSave();
shoppingToggle();
```

Shared comparators remain generic:

```javascript
compareName();
compareOrder();
```

## Voice-control rules for the next phase

- Voice operates only on existing products and navigation.
- Voice never creates, renames, categorizes, favorites, or permanently deletes products.
- Creating products always requires typed input in the modal.
- Product lookup searches the complete catalog.
- The active category affects display only.
- Voice commands do not change the active category.
- Ambiguous matches are never guessed.
- Every voice command produces visible feedback.
