import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const favouritesTable = pgTable("favourites", {
  id: serial("id").primaryKey(),
  userId: text("user_id", { length: 255 }).notNull(),
  recipeId: integer("recipie_id", { length: 255 }).notNull(),
  title: text("title", { length: 255 }).notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});
