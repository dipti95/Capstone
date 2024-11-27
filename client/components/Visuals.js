// import React, { useEffect, useState } from "react"
// import {
//   VictoryBar,
//   VictoryChart,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchAllPantries } from "../store/pantries"

// const Visuals = () => {
//   const { username, id } = useSelector((state) => state.auth)
//   const { pantries } = useSelector((state) => state)

//   const [selectedPantry, setSelectedPantry] = useState("View All Pantries")

//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(fetchAllPantries(id))
//   }, [])

//   let data = pantries.map((pantry) => {
//     const contents = pantry.ingredients.map((ingredient) => {
//       return {
//         item: ingredient.name,
//         pantryQty: ingredient.pantryIngredient.pantryQty,
//         category: ingredient.category,
//       }
//     })

//     return {
//       name: pantry.name,
//       contents: contents,
//     }
//   })

//   //console.log("Here's state", pantries)

//   const selectPantry = (pantries, pantryName) => {
//     const selectedPantry = pantries.filter(
//       (pantry) => pantry.name === pantryName
//     )
//     return selectedPantry[0].contents
//   }

//   const reducePantries = (pantries) => {
//     return pantries.reduce((prev, curr) => {
//       return prev.concat(curr.contents)
//     }, [])
//   }

//   if (selectedPantry === "View All Pantries") {
//     data = reducePantries(data)
//   } else {
//     data = selectPantry(data, selectedPantry)
//   }

//   const handlePantryChange = (e) => {
//     setSelectedPantry(e.target.value)
//   }

//   function groupByCategory(data) {
//     let categoricalData = {}
//     data.map((item) => {
//       if (categoricalData[item.category]) {
//         categoricalData[item.category] += item.pantryQty
//       } else {
//         categoricalData[item.category] = item.pantryQty
//       }
//     })
//     categoricalData = Object.keys(categoricalData).map((key) => ({
//       category: key,
//       quantity: categoricalData[key],
//     }))
//     return categoricalData
//   }

//   const categoricalData = groupByCategory(data)

//   return (
//     <div style={{ height: "550px" }}>
//       <>
//         <select name="pantries" onChange={(e) => handlePantryChange(e)}>
//           <option value="View All Pantries">View All Pantries</option>
//           {pantries.map((pantry) => (
//             <option key={pantry.id} value={pantry.name}>
//               {pantry.name}
//             </option>
//           ))}
//         </select>

//         <VictoryChart
//           theme={VictoryTheme.material}
//           domainPadding={{ x: 20 }}
//           height={500}
//           width={700}
//           animate={{ duration: 500 }}
//         >
//           <VictoryLabel
//             text={
//               selectedPantry === "View All Pantries"
//                 ? "Quantities of Foods in All Your Pantries"
//                 : `Quantities of Foods in Your ${selectedPantry} Pantry`
//             }
//             x={350}
//             y={-10}
//             textAnchor="middle"
//             style={{ fontSize: 25 }}
//           />
//           <VictoryAxis
//             axisLabelComponent={<VictoryLabel />}
//             label={"My Food"}
//             crossAxis
//             style={{
//               tickLabels: {
//                 angle: -45,
//                 fontSize: 10,
//                 textAnchor: "end",
//                 padding: 2,
//               },
//               axisLabel: {
//                 label: "My Food",
//                 fontFamily: "inherit",
//                 fontWeight: 100,
//                 letterSpacing: "1px",
//                 fontSize: 20,
//                 // padding: 50,
//                 padding: 100,
//               },
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             axisLabelComponent={<VictoryLabel />}
//             label={"Quantity"}
//             tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//             style={{
//               tickLabels: { fontSize: 10 },
//               axisLabel: {
//                 label: "Quantity",
//                 fontFamily: "inherit",
//                 fontWeight: 100,
//                 letterSpacing: "1px",
//                 fontSize: 20,
//                 padding: 32,
//               },
//             }}
//           />
//           <VictoryBar
//             barWidth={12}
//             data={categoricalData}
//             style={{
//               data: { fill: "#2c5f34" },
//             }}
//             x="category"
//             y="quantity"
//           />
//         </VictoryChart>
//       </>
//     </div>
//   )
// }

// export default Visuals

// import React, { useEffect, useState } from "react"
// import {
//   VictoryBar,
//   VictoryChart,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchAllPantries } from "../store/pantries"

// const Visuals = () => {
//   const { username, id } = useSelector((state) => state.auth)
//   const { pantries } = useSelector((state) => state)

//   const [selectedPantry, setSelectedPantry] = useState("View All Pantries")

//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(fetchAllPantries(id))
//   }, [dispatch, id])

//   let data = pantries.map((pantry) => {
//     const contents = pantry.ingredients.map((ingredient) => {
//       return {
//         item: ingredient.name,
//         pantryQty: ingredient.pantryIngredient.pantryQty,
//         category: ingredient.category,
//       }
//     })

//     return {
//       name: pantry.name,
//       contents: contents,
//     }
//   })

//   const selectPantry = (pantries, pantryName) => {
//     const selectedPantry = pantries.filter(
//       (pantry) => pantry.name === pantryName
//     )
//     return selectedPantry[0].contents
//   }

//   const reducePantries = (pantries) => {
//     return pantries.reduce((prev, curr) => {
//       return prev.concat(curr.contents)
//     }, [])
//   }

//   if (selectedPantry === "View All Pantries") {
//     data = reducePantries(data)
//   } else {
//     data = selectPantry(data, selectedPantry)
//   }

//   const handlePantryChange = (e) => {
//     setSelectedPantry(e.target.value)
//   }

//   function groupByCategory(data) {
//     let categoricalData = {}
//     data.map((item) => {
//       if (categoricalData[item.category]) {
//         categoricalData[item.category] += item.pantryQty
//       } else {
//         categoricalData[item.category] = item.pantryQty
//       }
//     })
//     categoricalData = Object.keys(categoricalData).map((key) => ({
//       category: key,
//       quantity: categoricalData[key],
//     }))
//     return categoricalData
//   }

//   const categoricalData = groupByCategory(data)

//   return (
//     <div style={{ height: "600px", padding: "10px" }}>
//       <select
//         name="pantries"
//         onChange={(e) => handlePantryChange(e)}
//         style={{ marginBottom: "20px" }}
//       >
//         <option value="View All Pantries">View All Pantries</option>
//         {pantries.map((pantry) => (
//           <option key={pantry.id} value={pantry.name}>
//             {pantry.name}
//           </option>
//         ))}
//       </select>

//       <VictoryChart
//         theme={VictoryTheme.material}
//         domainPadding={{ x: 60 }}
//         height={500}
//         width={700}
//         animate={{ duration: 500 }}
//         padding={{ top: 60, bottom: 120, left: 100, right: 50 }}
//       >
//         <VictoryLabel
//           text={
//             selectedPantry === "View All Pantries"
//               ? "Quantities of Foods in All Your Pantries"
//               : `Quantities of Foods in Your ${selectedPantry} Pantry`
//           }
//           x={350}
//           y={30}
//           textAnchor="middle"
//           style={{ fontSize: 20 }}
//         />
//         <VictoryAxis
//           axisLabelComponent={<VictoryLabel />}
//           label="My Food"
//           crossAxis
//           style={{
//             tickLabels: {
//               angle: -60, // Adjusted angle for better readability
//               fontSize: 10,
//               textAnchor: "end",
//               padding: 10, // Added spacing between labels and axis
//             },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 90, // Added padding to separate label from ticks
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           axisLabelComponent={<VictoryLabel />}
//           label="Quantity"
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           style={{
//             tickLabels: { fontSize: 10 },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 70, // Added padding to ensure visibility
//               angle: -90, // Rotated for proper alignment
//               textAnchor: "middle",
//             },
//           }}
//         />
//         <VictoryBar
//           barWidth={15} // Adjusted bar width for better spacing
//           data={categoricalData}
//           style={{
//             data: { fill: "#2c5f34" },
//           }}
//           x="category"
//           y="quantity"
//         />
//       </VictoryChart>
//     </div>
//   )
// }

// export default Visuals

// import React, { useEffect, useState } from "react"
// import {
//   VictoryBar,
//   VictoryChart,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchAllPantries } from "../store/pantries"

// const Visuals = () => {
//   const { username, id } = useSelector((state) => state.auth)
//   const { pantries } = useSelector((state) => state)

//   const [selectedPantry, setSelectedPantry] = useState("View All Pantries")

//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(fetchAllPantries(id))
//   }, [dispatch, id])

//   let data = pantries.map((pantry) => {
//     const contents = pantry.ingredients.map((ingredient) => {
//       return {
//         item: ingredient.name,
//         pantryQty: ingredient.pantryIngredient.pantryQty,
//         category: ingredient.category,
//       }
//     })

//     return {
//       name: pantry.name,
//       contents: contents,
//     }
//   })

//   const selectPantry = (pantries, pantryName) => {
//     const selectedPantry = pantries.filter(
//       (pantry) => pantry.name === pantryName
//     )
//     return selectedPantry[0].contents
//   }

//   const reducePantries = (pantries) => {
//     return pantries.reduce((prev, curr) => {
//       return prev.concat(curr.contents)
//     }, [])
//   }

//   if (selectedPantry === "View All Pantries") {
//     data = reducePantries(data)
//   } else {
//     data = selectPantry(data, selectedPantry)
//   }

//   const handlePantryChange = (e) => {
//     setSelectedPantry(e.target.value)
//   }

//   function groupByCategory(data) {
//     let categoricalData = {}
//     data.map((item) => {
//       if (categoricalData[item.category]) {
//         categoricalData[item.category] += item.pantryQty
//       } else {
//         categoricalData[item.category] = item.pantryQty
//       }
//     })
//     categoricalData = Object.keys(categoricalData).map((key) => ({
//       category: key,
//       quantity: categoricalData[key],
//     }))
//     return categoricalData
//   }

//   const categoricalData = groupByCategory(data)

//   return (
//     <div style={{ height: "600px", padding: "10px" }}>
//       <select
//         name="pantries"
//         onChange={(e) => handlePantryChange(e)}
//         style={{ marginBottom: "20px" }}
//       >
//         <option value="View All Pantries">View All Pantries</option>
//         {pantries.map((pantry) => (
//           <option key={pantry.id} value={pantry.name}>
//             {pantry.name}
//           </option>
//         ))}
//       </select>

//       <VictoryChart
//         theme={VictoryTheme.material}
//         domainPadding={{ x: 60 }}
//         height={500}
//         width={700}
//         animate={{ duration: 500 }}
//         padding={{ top: 60, bottom: 100, left: 100, right: 50 }} // Reduced bottom padding
//       >
//         <VictoryLabel
//           text={
//             selectedPantry === "View All Pantries"
//               ? "Quantities of Foods in All Your Pantries"
//               : `Quantities of Foods in Your ${selectedPantry} Pantry`
//           }
//           x={350}
//           y={30}
//           textAnchor="middle"
//           style={{
//             fontSize: 20,
//             fontWeight: "bold",
//             fontFamily: "inherit",
//           }}
//         />
//         <VictoryAxis
//           axisLabelComponent={<VictoryLabel />}
//           label="My Food"
//           crossAxis
//           style={{
//             tickLabels: {
//               angle: -45, // Rotated for better fit
//               fontSize: 10,
//               textAnchor: "end",
//               padding: 5, // Reduced padding between tick labels and axis
//             },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 50, // Reduced padding to keep "My Food" inside the chart
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           axisLabelComponent={<VictoryLabel />}
//           label="Quantity"
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           style={{
//             tickLabels: { fontSize: 10 },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 70,
//               angle: -90,
//               textAnchor: "middle",
//             },
//           }}
//         />
//         <VictoryBar
//           barWidth={15}
//           data={categoricalData}
//           style={{
//             data: { fill: "#2c5f34" },
//           }}
//           x="category"
//           y="quantity"
//         />
//       </VictoryChart>
//     </div>
//   )
// }

// export default Visuals

// -------------------
//---------------------
//----------Final One is below

import React, { useEffect, useState } from "react"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllPantries } from "../store/pantries"

const Visuals = () => {
  const { username, id } = useSelector((state) => state.auth)
  const { pantries } = useSelector((state) => state)

  const [selectedPantry, setSelectedPantry] = useState("View All Pantries")

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllPantries(id))
  }, [dispatch, id])

  let data = pantries.map((pantry) => {
    const contents = pantry.ingredients.map((ingredient) => {
      return {
        item: ingredient.name,
        pantryQty: ingredient.pantryIngredient.pantryQty,
        category: ingredient.category,
      }
    })

    return {
      name: pantry.name,
      contents: contents,
    }
  })

  const selectPantry = (pantries, pantryName) => {
    const selectedPantry = pantries.filter(
      (pantry) => pantry.name === pantryName
    )
    return selectedPantry[0].contents
  }

  const reducePantries = (pantries) => {
    return pantries.reduce((prev, curr) => {
      return prev.concat(curr.contents)
    }, [])
  }

  if (selectedPantry === "View All Pantries") {
    data = reducePantries(data)
  } else {
    data = selectPantry(data, selectedPantry)
  }

  const handlePantryChange = (e) => {
    setSelectedPantry(e.target.value)
  }

  function groupByCategory(data) {
    let categoricalData = {}
    data.map((item) => {
      if (categoricalData[item.category]) {
        categoricalData[item.category] += item.pantryQty
      } else {
        categoricalData[item.category] = item.pantryQty
      }
    })
    categoricalData = Object.keys(categoricalData).map((key) => ({
      category: key,
      quantity: categoricalData[key],
    }))
    return categoricalData
  }

  const categoricalData = groupByCategory(data)

  return (
    <div style={{ height: "500px", padding: "10px" }}>
      {" "}
      {/* Reduced height */}
      <select
        name="pantries"
        onChange={(e) => handlePantryChange(e)}
        style={{ marginBottom: "20px" }}
      >
        <option value="View All Pantries">View All Pantries</option>
        {pantries.map((pantry) => (
          <option key={pantry.id} value={pantry.name}>
            {pantry.name}
          </option>
        ))}
      </select>
      <VictoryChart
        // theme={VictoryTheme.material}
        // domainPadding={{ x: 50 }} // Adjusted for compactness
        // height={400} // Reduced chart height
        // width={600} // Reduced chart width
        // animate={{ duration: 500 }}
        // padding={{ top: 50, bottom: 100, left: 80, right: 40 }} // Adjusted padding for alignment
        domainPadding={{ x: 40 }}
        height={500}
        width={700}
        animate={{ duration: 500 }}
        padding={{ top: 80, bottom: 120, left: 100, right: 50 }}
      >
        <VictoryLabel
          text={
            selectedPantry === "View All Pantries"
              ? "Quantities of Foods in All Your Pantries"
              : `Quantities of Foods in Your ${selectedPantry} Pantry`
          }
          x={350} // Adjusted for smaller width
          y={30} // Moved closer to the chart
          textAnchor="middle"
          style={{
            fontSize: 20, // Slightly smaller font size for a smaller chart
          }}
        />
        <VictoryAxis
          axisLabelComponent={<VictoryLabel />}
          label="My Food"
          crossAxis
          style={{
            tickLabels: {
              angle: -45,
              fontSize: 8, // Reduced font size for tick labels
              textAnchor: "end",
              padding: 5,
            },
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 14, // Slightly smaller axis label font
              padding: 60, // Adjusted padding for compactness
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<VictoryLabel />}
          label="Quantity"
          tickFormat={(t) => (Number.isInteger(t) ? t : null)}
          style={{
            tickLabels: { fontSize: 8 }, // Reduced font size for dependent axis
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 14, // Slightly smaller font for consistency
              padding: 50, // Reduced padding to fit a smaller chart
              angle: -90,
              textAnchor: "middle",
            },
          }}
        />
        <VictoryBar
          barWidth={10} // Adjusted bar width for smaller size
          data={categoricalData}
          style={{
            data: { fill: "#2c5f34" },
          }}
          x="category"
          y="quantity"
        />
      </VictoryChart>
    </div>
  )
}

export default Visuals
