import { and, eq } from "drizzle-orm";
import express from "express";
import job from "./config/cron.js";
import { db } from "./config/db.js";
import { ENV } from "./config/env.js";
import { favouritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5000;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Hello, World!", success: true });
});

app.get("/api/favourites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const userFavourites = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId));

    res.status(200).json({ data: userFavourites, success: true });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

app.post("/api/favourites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const newFavourite = await db
      .insert(favouritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json({ data: newFavourite[0], success: true });
  } catch (error) {
    console.error("Error adding favourite:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    if (!userId || !recipeId) {
      return res
        .status(400)
        .json({ message: "Missing required parameters", success: false });
    }

    await db
      .delete(favouritesTable)
      .where(
        and(
          eq(favouritesTable.userId, userId),
          eq(favouritesTable.recipeId, parseInt(recipeId))
        )
      );

    res.status(200).json({ message: "Favourite removed", success: true });
  } catch (error) {
    console.error("Error removing favourite:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
