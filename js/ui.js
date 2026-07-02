function screenDraw()
{
    const app = elementGet("app");

    elementClear(app);

    for (const category of db.categories)
    {
        app.appendChild(categoryElementCreate(category));
    }
}