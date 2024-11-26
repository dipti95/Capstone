// /* global describe beforeEach it */

// import React from "react"
// import { expect } from "chai"
// import { mount } from "enzyme"
// import Adapter from "enzyme-adapter-react-16"
// import enzyme from "enzyme"
// import sinon from "sinon"
// import sinonChai from "sinon-chai"
// import { useSelector, useDispatch } from "react-redux"
// import Home from "./Home"
// import { fetchAllPantries } from "../store/pantries"

// enzyme.configure({ adapter: new Adapter() })
// chai.use(sinonChai)

// describe("Home Component", () => {
//   let home
//   let useSelectorStub
//   let useDispatchStub
//   let dispatchSpy
//   let fetchAllPantriesStub

//   beforeEach(() => {
//     // Stub useSelector
//     useSelectorStub = sinon.stub(require("react-redux"), "useSelector")
//     useSelectorStub.callsFake((selector) => {
//       if (selector.toString().includes("state => state.auth")) {
//         return { username: "cody", id: 1 }
//       } else if (selector.toString().includes("state => state.pantries")) {
//         return { pantries: [] }
//       }
//       return null
//     })

//     // Stub useDispatch
//     dispatchSpy = sinon.spy()
//     useDispatchStub = sinon
//       .stub(require("react-redux"), "useDispatch")
//       .returns(dispatchSpy)

//     // Stub fetchAllPantries
//     fetchAllPantriesStub = sinon
//       .stub(require("../store/pantries"), "fetchAllPantries")
//       .returns({ type: "FETCH_PANTRIES" })

//     // Mount the component
//     home = mount(<Home />)
//   })

//   afterEach(() => {
//     useSelectorStub.restore()
//     useDispatchStub.restore()
//     fetchAllPantriesStub.restore()
//     home.unmount()
//   })

//   it("renders the Dashboard heading in an h1", () => {
//     expect(home.find("h1").text()).to.equal("Dashboard")
//   })

//   it("dispatches fetchAllPantries on mount", () => {
//     expect(dispatchSpy).to.have.been.calledOnce
//     expect(fetchAllPantriesStub).to.have.been.calledWith(1)
//     expect(dispatchSpy).to.have.been.calledWith({ type: "FETCH_PANTRIES" })
//   })

//   it("renders all child components", () => {
//     expect(home.find("VisualNutrition")).to.have.lengthOf(1)
//     expect(home.find("Visuals")).to.have.lengthOf(1)
//     expect(home.find("Visual2")).to.have.lengthOf(1)
//     expect(home.find("ListNutritionGraph")).to.have.lengthOf(1)
//   })
// })
