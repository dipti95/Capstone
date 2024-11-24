// pantryModel.test.js

const { expect } = require("chai")
const Pantry = require("./Pantry")

describe("Pantry Model", () => {
  describe("Field Validations", () => {
    it("should require a name", async () => {
      const pantry = Pantry.build({})
      try {
        await pantry.validate()
        throw new Error("Validation should have failed without a name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal("pantry.name cannot be null")
      }
    })

    it("should enforce notEmpty validation on name", async () => {
      const pantry = Pantry.build({ name: "" })
      try {
        await pantry.validate()
        throw new Error("Validation should have failed with an empty name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal(
          "Validation notEmpty on name failed"
        )
      }
    })

    it("should create a pantry with a valid name", async () => {
      const pantry = Pantry.build({ name: "Main Pantry" })
      await pantry.validate()
      expect(pantry.name).to.equal("Main Pantry")
    })
  })
})
