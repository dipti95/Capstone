"use strict"

const {
  db,
  models: {
    User,
    Recipe,
    RecipeIngredient,
    ShoppingList,
    ShoppingListIngredient,
    Ingredient,
    Pantry,
    PantryIngredient,
  },
} = require("../server/db")

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log("db synced!")

  // Creating Users
  const users = await Promise.all([
    User.create({ username: "cody", password: "123" }),
    User.create({ username: "murphy", password: "123" }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  }
}

async function runSeed() {
  console.log("seeding...")
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log("closing db connection")
    await db.close()
    console.log("db connection closed")
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
