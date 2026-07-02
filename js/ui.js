function screenDraw() {
  const app = document.getElementById("app");

  app.innerHTML = "";

  for (const category of db.categories) {
    app.appendChild(categoryElementCreate(category));
  }
}