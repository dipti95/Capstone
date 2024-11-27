// import React, { useEffect, useState } from "react"
// import {
//   VictoryBar,
//   VictoryChart,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchShoppingListHistory } from "../store/ShoppingList"

// const Visual2 = () => {
//   const dispatch = useDispatch()
//   const { id } = useSelector((state) => state.auth)
//   const { shoppingHistory } = useSelector((state) => state.shoppingList)

//   useEffect(() => {
//     dispatch(fetchShoppingListHistory(id))
//   }, [])

//   let data = []
//   let innerData = []
//   let tempData = {}
//   let finalData = []

//   if (shoppingHistory) {
//     data = shoppingHistory.map((list) => {
//       return list.ingredients.map((item) => {
//         innerData.push(item.name)
//         return item.name
//       })
//     })
//   }

//   innerData.forEach((item) => {
//     if (tempData[item]) {
//       tempData[item] += 1
//     } else {
//       tempData[item] = 1
//     }
//   })

//   for (const [key, value] of Object.entries(tempData)) {
//     finalData.push({ item: key, frequency: value })
//   }

//   return (
//     <div style={{ height: "560px" }}>
//       <VictoryChart
//         theme={VictoryTheme.material}
//         domainPadding={{ x: 20 }}
//         height={500}
//         width={700}
//         animate={{ duration: 500 }}
//       >
//         <VictoryLabel
//           text="Frequently Bought Items"
//           x={350}
//           y={0}
//           textAnchor="middle"
//           style={{ fontSize: 25 }}
//         />
//         <VictoryAxis
//           axisLabelComponent={<VictoryLabel />}
//           label={"My Food"}
//           crossAxis
//           style={{
//             tickLabels: {
//               textAnchor: "end",
//               padding: 2,
//               angle: -45,
//               fontSize: 10,
//             },
//             axisLabel: {
//               label: "My Food",
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 20,
//               // padding: 50,
//               padding: 100,
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           axisLabelComponent={<VictoryLabel />}
//           label={"Frequency"}
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           style={{
//             tickLabels: { fontSize: 10, textAnchor: "end" },
//             axisLabel: {
//               label: "frequency",
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 20,
//               padding: 30,
//             },
//           }}
//         />
//         <VictoryBar
//           data={finalData}
//           style={{
//             data: { fill: "#2c5f34" },
//           }}
//           x="item"
//           y="frequency"
//         />
//       </VictoryChart>
//     </div>
//   )
// }

// export default Visual2

// import React, { useEffect, useState } from "react"
// import { VictoryPie, VictoryLabel } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchShoppingListHistory } from "../store/ShoppingList"

// const Visual2 = () => {
//   const dispatch = useDispatch()
//   const { id } = useSelector((state) => state.auth)
//   const { shoppingHistory } = useSelector((state) => state.shoppingList)

//   const [selectedSlice, setSelectedSlice] = useState(null) // Track selected slice for zoom

//   useEffect(() => {
//     dispatch(fetchShoppingListHistory(id))
//   }, [dispatch, id])

//   let innerData = []
//   let tempData = {}
//   let finalData = []

//   // Process shopping history to calculate item frequency
//   if (shoppingHistory) {
//     shoppingHistory.forEach((list) => {
//       list.ingredients.forEach((item) => {
//         innerData.push(item.name)
//       })
//     })
//   }

//   innerData.forEach((item) => {
//     if (tempData[item]) {
//       tempData[item] += 1
//     } else {
//       tempData[item] = 1
//     }
//   })

//   for (const [key, value] of Object.entries(tempData)) {
//     finalData.push({ item: key, frequency: value })
//   }

//   // Sort by frequency and get the top 10 items
//   finalData.sort((a, b) => b.frequency - a.frequency)
//   const top10Data = finalData.slice(0, 10)

//   // Calculate percentage based on top 10 items only
//   const totalTop10Frequency = top10Data.reduce(
//     (sum, item) => sum + item.frequency,
//     0
//   )
//   const top10DataWithPercentage = top10Data.map((item) => ({
//     ...item,
//     percentage: ((item.frequency / totalTop10Frequency) * 100).toFixed(1),
//   }))

//   // Handle slice selection for zooming
//   const handleSliceClick = (sliceIndex) => {
//     setSelectedSlice(sliceIndex === selectedSlice ? null : sliceIndex)
//   }

//   return (
//     <div style={{ height: "600px", textAlign: "center" }}>
//       <VictoryLabel
//         text="Top 10 Frequently Bought Items"
//         x={350}
//         y={30}
//         textAnchor="middle"
//         style={{ fontSize: 25 }}
//       />
//       <VictoryPie
//         data={top10DataWithPercentage}
//         x="item"
//         y="frequency"
//         labels={({ datum }) => `${datum.item}: ${datum.percentage}%`}
//         style={{
//           labels: { fontSize: 10, fill: "#333" },
//           data: {
//             fillOpacity: ({ index }) =>
//               selectedSlice === null || selectedSlice === index ? 1 : 0.3, // Dim non-selected slices
//             stroke: ({ index }) => (selectedSlice === index ? "#000" : "none"), // Highlight selected slice
//             strokeWidth: 2,
//           },
//         }}
//         labelRadius={120} // Position labels outside the chart
//         radius={({ index }) => (selectedSlice === index ? 150 : 100)} // Zoom into the selected slice
//         colorScale={[
//           "#6A994E",
//           "#A7C957",
//           "#1B9AAA",
//           "#E3651D",
//           "#F4A259",
//           "#FF6F59",
//           "#FFD639",
//           "#72B4A3",
//           "#A7D3A6",
//           "#D4A5A5",
//         ]}
//         events={[
//           {
//             target: "data",
//             eventHandlers: {
//               onClick: (event, props) => {
//                 handleSliceClick(props.index) // Trigger zoom functionality on click
//               },
//             },
//           },
//         ]}
//       />
//     </div>
//   )
// }

// export default Visual2

//// CATEGORY-------------------------

// import React, { useEffect, useState } from "react"
// import { VictoryPie, VictoryLabel } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchShoppingListHistory } from "../store/ShoppingList"

// const VisualCategories = () => {
//   const dispatch = useDispatch()
//   const { id } = useSelector((state) => state.auth)
//   const { shoppingHistory } = useSelector((state) => state.shoppingList)

//   const [selectedSlice, setSelectedSlice] = useState(null) // Track selected slice for zoom

//   useEffect(() => {
//     dispatch(fetchShoppingListHistory(id))
//   }, [dispatch, id])

//   let categoryData = []
//   let tempData = {}
//   let finalData = []

//   // Process shopping history to calculate category frequency
//   if (shoppingHistory) {
//     shoppingHistory.forEach((list) => {
//       list.ingredients.forEach((item) => {
//         categoryData.push(item.category) // Push categories instead of names
//       })
//     })
//   }

//   categoryData.forEach((category) => {
//     if (tempData[category]) {
//       tempData[category] += 1
//     } else {
//       tempData[category] = 1
//     }
//   })

//   for (const [key, value] of Object.entries(tempData)) {
//     finalData.push({ category: key, frequency: value })
//   }

//   // Sort by frequency and get the top 10 categories
//   finalData.sort((a, b) => b.frequency - a.frequency)
//   const top10Categories = finalData.slice(0, 10)

//   // Calculate percentage based on top 10 categories only
//   const totalTop10Frequency = top10Categories.reduce(
//     (sum, item) => sum + item.frequency,
//     0
//   )
//   const top10CategoriesWithPercentage = top10Categories.map((item) => ({
//     ...item,
//     percentage: ((item.frequency / totalTop10Frequency) * 100).toFixed(1),
//   }))

//   // Handle slice selection for zooming
//   const handleSliceClick = (sliceIndex) => {
//     setSelectedSlice(sliceIndex === selectedSlice ? null : sliceIndex)
//   }

//   return (
//     <div style={{ height: "600px", textAlign: "center" }}>
//       <VictoryLabel
//         text="Top 10 Frequently Bought Categories"
//         x={350}
//         y={30}
//         textAnchor="middle"
//         style={{ fontSize: 25 }}
//       />
//       <VictoryPie
//         data={top10CategoriesWithPercentage}
//         x="category"
//         y="frequency"
//         labels={({ datum }) => `${datum.category}: ${datum.percentage}%`}
//         style={{
//           labels: { fontSize: 10, fill: "#333" },
//           data: {
//             fillOpacity: ({ index }) =>
//               selectedSlice === null || selectedSlice === index ? 1 : 0.3, // Dim non-selected slices
//             stroke: ({ index }) => (selectedSlice === index ? "#000" : "none"), // Highlight selected slice
//             strokeWidth: 2,
//           },
//         }}
//         labelRadius={120} // Position labels outside the chart
//         radius={({ index }) => (selectedSlice === index ? 150 : 100)} // Zoom into the selected slice
//         colorScale={[
//           "#6A994E",
//           "#A7C957",
//           "#1B9AAA",
//           "#E3651D",
//           "#F4A259",
//           "#FF6F59",
//           "#FFD639",
//           "#72B4A3",
//           "#A7D3A6",
//           "#D4A5A5",
//         ]}
//         events={[
//           {
//             target: "data",
//             eventHandlers: {
//               onClick: (event, props) => {
//                 handleSliceClick(props.index) // Trigger zoom functionality on click
//               },
//             },
//           },
//         ]}
//       />
//     </div>
//   )
// }

// export default VisualCategories

// import React, { useEffect, useState } from "react"
// import { VictoryPie, VictoryLabel, VictoryTooltip } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchShoppingListHistory } from "../store/ShoppingList"

// const VisualCategories = () => {
//   const dispatch = useDispatch()
//   const { id } = useSelector((state) => state.auth)
//   const { shoppingHistory } = useSelector((state) => state.shoppingList)

//   const [selectedSlice, setSelectedSlice] = useState(null) // Track selected slice for zoom
//   const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null) // Track selected category details

//   useEffect(() => {
//     dispatch(fetchShoppingListHistory(id))
//   }, [dispatch, id])

//   let categoryData = []
//   let tempData = {}
//   let finalData = []

//   // Process shopping history to calculate category frequency
//   if (shoppingHistory) {
//     shoppingHistory.forEach((list) => {
//       list.ingredients.forEach((item) => {
//         categoryData.push(item.category) // Push categories instead of names
//       })
//     })
//   }

//   categoryData.forEach((category) => {
//     if (tempData[category]) {
//       tempData[category] += 1
//     } else {
//       tempData[category] = 1
//     }
//   })

//   for (const [key, value] of Object.entries(tempData)) {
//     finalData.push({ category: key, frequency: value })
//   }

//   // Sort by frequency and get the top 10 categories
//   finalData.sort((a, b) => b.frequency - a.frequency)
//   const top10Categories = finalData.slice(0, 10)

//   // Calculate percentage based on top 10 categories only
//   const totalTop10Frequency = top10Categories.reduce(
//     (sum, item) => sum + item.frequency,
//     0
//   )
//   const top10CategoriesWithPercentage = top10Categories.map((item) => ({
//     ...item,
//     percentage: ((item.frequency / totalTop10Frequency) * 100).toFixed(1),
//   }))

//   // Handle slice selection for zooming
//   const handleSliceClick = (datum, index) => {
//     if (selectedSlice === index) {
//       setSelectedSlice(null) // Reset if clicked again
//       setSelectedCategoryInfo(null)
//     } else {
//       setSelectedSlice(index)
//       setSelectedCategoryInfo(datum) // Show details for selected category
//     }
//   }

//   return (
//     <div style={{ height: "600px", textAlign: "center" }}>
//       <VictoryLabel
//         text="Top 10 Frequently Bought Categories"
//         x={350}
//         y={-20} // Reduce vertical space between heading and chart
//         textAnchor="middle"
//         style={{ fontSize: 25 }} // Reduced heading font size for proportional look
//       />

//       {/* Pie Chart */}
//       <VictoryPie
//         data={top10CategoriesWithPercentage}
//         x="category"
//         y="frequency"
//         labelComponent={
//           <VictoryTooltip
//             style={{ fontSize: 12 }} // Regular font size, no bold
//             flyoutStyle={{ fill: "white", stroke: "#ccc" }}
//             flyoutPadding={10}
//           />
//         }
//         labels={({ datum }) => `${datum.category}\n${datum.percentage}%`} // Tooltip content
//         style={{
//           data: {
//             fillOpacity: ({ index }) =>
//               selectedSlice === null || selectedSlice === index ? 1 : 0.3, // Dim non-selected slices
//             stroke: ({ index }) => (selectedSlice === index ? "#000" : "none"), // Highlight selected slice
//             strokeWidth: 2,
//           },
//         }}
//         radius={({ index }) => (selectedSlice === index ? 150 : 120)} // Zoom into the selected slice
//         colorScale={[
//           "#6A994E",
//           "#A7C957",
//           "#1B9AAA",
//           "#E3651D",
//           "#F4A259",
//           "#FF6F59",
//           "#FFD639",
//           "#72B4A3",
//           "#A7D3A6",
//           "#D4A5A5",
//         ]}
//         width={400} // Adjust width to center the chart better
//         height={400} // Adjust height to prevent unnecessary vertical space
//         events={[
//           {
//             target: "data",
//             eventHandlers: {
//               onClick: (event, props) => {
//                 handleSliceClick(props.datum, props.index) // Handle slice click
//               },
//             },
//           },
//         ]}
//       />

//       {/* Display selected category details */}
//       {selectedCategoryInfo && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Selected Category Details</h3>
//           <p>
//             <strong>Category:</strong> {selectedCategoryInfo.category}
//           </p>
//           <p>
//             <strong>Percentage:</strong> {selectedCategoryInfo.percentage}%
//           </p>
//           <p>
//             <strong>Frequency:</strong> {selectedCategoryInfo.frequency}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VisualCategories

// import React, { useEffect, useState } from "react"
// import { VictoryPie, VictoryLabel, VictoryTooltip } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { fetchShoppingListHistory } from "../store/ShoppingList"

// const VisualCategories = () => {
//   const dispatch = useDispatch()
//   const { id } = useSelector((state) => state.auth)
//   const { shoppingHistory } = useSelector((state) => state.shoppingList)

//   const [selectedSlice, setSelectedSlice] = useState(null) // Track selected slice for zoom
//   const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null) // Track selected category details

//   useEffect(() => {
//     dispatch(fetchShoppingListHistory(id))
//   }, [dispatch, id])

//   let categoryData = []
//   let tempData = {}
//   let finalData = []

//   // Process shopping history to calculate category frequency
//   if (shoppingHistory) {
//     shoppingHistory.forEach((list) => {
//       list.ingredients.forEach((item) => {
//         categoryData.push(item.category) // Push categories instead of names
//       })
//     })
//   }

//   categoryData.forEach((category) => {
//     if (tempData[category]) {
//       tempData[category] += 1
//     } else {
//       tempData[category] = 1
//     }
//   })

//   for (const [key, value] of Object.entries(tempData)) {
//     finalData.push({ category: key, frequency: value })
//   }

//   // Sort by frequency and get the top 10 categories
//   finalData.sort((a, b) => b.frequency - a.frequency)
//   const top10Categories = finalData.slice(0, 10)

//   // Calculate percentage based on top 10 categories only
//   const totalTop10Frequency = top10Categories.reduce(
//     (sum, item) => sum + item.frequency,
//     0
//   )
//   const top10CategoriesWithPercentage = top10Categories.map((item) => ({
//     ...item,
//     percentage: ((item.frequency / totalTop10Frequency) * 100).toFixed(1),
//   }))

//   // Handle slice selection for zooming
//   const handleSliceClick = (datum, index) => {
//     if (selectedSlice === index) {
//       setSelectedSlice(null) // Reset if clicked again
//       setSelectedCategoryInfo(null)
//     } else {
//       setSelectedSlice(index)
//       setSelectedCategoryInfo(datum) // Show details for selected category
//     }
//   }

//   return (
//     <div style={{ height: "600px", textAlign: "center", marginBottom: "50px" }}>
//       <VictoryLabel
//         text="Top 10 Frequently Bought Categories"
//         x={350}
//         y={-20} // Adjusted to align with the bar chart's heading placement
//         textAnchor="middle"
//         style={{ fontSize: 25, fontFamily: "inherit", fontWeight: 100 }} // Kept the style consistent
//       />

//       {/* Pie Chart */}
//       <VictoryPie
//         data={top10CategoriesWithPercentage}
//         x="category"
//         y="frequency"
//         labelComponent={
//           <VictoryTooltip
//             style={{ fontSize: 12 }}
//             flyoutStyle={{ fill: "white", stroke: "#ccc" }}
//             flyoutPadding={10}
//           />
//         }
//         labels={({ datum }) => `${datum.category}\n${datum.percentage}%`} // Tooltip content
//         style={{
//           data: {
//             fillOpacity: ({ index }) =>
//               selectedSlice === null || selectedSlice === index ? 1 : 0.3, // Dim non-selected slices
//             stroke: ({ index }) => (selectedSlice === index ? "#000" : "none"), // Highlight selected slice
//             strokeWidth: 2,
//           },
//         }}
//         radius={({ index }) => (selectedSlice === index ? 150 : 120)} // Zoom into the selected slice
//         colorScale={[
//           "#6A994E",
//           "#A7C957",
//           "#1B9AAA",
//           "#E3651D",
//           "#F4A259",
//           "#FF6F59",
//           "#FFD639",
//           "#72B4A3",
//           "#A7D3A6",
//           "#D4A5A5",
//         ]}
//         width={400}
//         height={400}
//         events={[
//           {
//             target: "data",
//             eventHandlers: {
//               onClick: (event, props) => {
//                 handleSliceClick(props.datum, props.index) // Handle slice click
//               },
//             },
//           },
//         ]}
//       />

//       {/* Display selected category details */}
//       {selectedCategoryInfo && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Selected Category Details</h3>
//           <p>
//             <strong>Category:</strong> {selectedCategoryInfo.category}
//           </p>
//           <p>
//             <strong>Percentage:</strong> {selectedCategoryInfo.percentage}%
//           </p>
//           <p>
//             <strong>Frequency:</strong> {selectedCategoryInfo.frequency}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VisualCategories

//-------------CorrectOne below

// -------------------
//---------------------
//----------Final One is below

import React, { useEffect, useState } from "react"
import { VictoryPie, VictoryLabel, VictoryTooltip } from "victory"
import { useSelector, useDispatch } from "react-redux"
import { fetchShoppingListHistory } from "../store/ShoppingList"

const VisualCategories = () => {
  const dispatch = useDispatch()
  const { id } = useSelector((state) => state.auth)
  const { shoppingHistory } = useSelector((state) => state.shoppingList)

  const [selectedSlice, setSelectedSlice] = useState(null)
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null)
  const [chartDimensions, setChartDimensions] = useState({
    width: 300,
    height: 300,
    radius: 100,
  })

  useEffect(() => {
    dispatch(fetchShoppingListHistory(id))
  }, [dispatch, id])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth * 0.4 // 40% of screen width
      const height = Math.min(width, 300) // Max height 300px
      const radius = Math.min(width / 3, 100) // Adjust radius proportionally
      setChartDimensions({ width, height, radius })
    }

    handleResize() // Set initial dimensions
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  let categoryData = []
  let tempData = {}
  let finalData = []

  if (shoppingHistory) {
    shoppingHistory.forEach((list) => {
      list.ingredients.forEach((item) => {
        categoryData.push(item.category)
      })
    })
  }

  categoryData.forEach((category) => {
    if (tempData[category]) {
      tempData[category] += 1
    } else {
      tempData[category] = 1
    }
  })

  for (const [key, value] of Object.entries(tempData)) {
    finalData.push({ category: key, frequency: value })
  }

  finalData.sort((a, b) => b.frequency - a.frequency)
  const top10Categories = finalData.slice(0, 10)

  const totalTop10Frequency = top10Categories.reduce(
    (sum, item) => sum + item.frequency,
    0
  )
  const top10CategoriesWithPercentage = top10Categories.map((item) => ({
    ...item,
    percentage: ((item.frequency / totalTop10Frequency) * 100).toFixed(1),
  }))

  const handleSliceClick = (datum, index) => {
    if (selectedSlice === index) {
      setSelectedSlice(null)
      setSelectedCategoryInfo(null)
    } else {
      setSelectedSlice(index)
      setSelectedCategoryInfo(datum)
    }
  }

  return (
    <div
      style={{
        height: "350px", // Fixed height for the container
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <VictoryLabel
        text="Top 10 Frequently Bought Categories"
        // x={chartDimensions.width / 2}
        x={350}
        y={20}
        textAnchor="middle"
        style={{
          fontSize: 20,
          // fontSize: Math.min(chartDimensions.width / 15, 16),
          // fontFamily: "inherit",
          // fontWeight: 100,
        }}
      />

      <VictoryPie
        data={top10CategoriesWithPercentage}
        x="category"
        y="frequency"
        labelComponent={
          <VictoryTooltip
            style={{ fontSize: Math.min(chartDimensions.width / 25, 10) }}
            flyoutStyle={{ fill: "white", stroke: "#ccc" }}
            flyoutPadding={5}
          />
        }
        labels={({ datum }) => `${datum.category}\n${datum.percentage}%`}
        style={{
          data: {
            fillOpacity: ({ index }) =>
              selectedSlice === null || selectedSlice === index ? 1 : 0.3,
            stroke: ({ index }) => (selectedSlice === index ? "#000" : "none"),
            strokeWidth: 2,
          },
        }}
        radius={({ index }) =>
          selectedSlice === index
            ? chartDimensions.radius + 10
            : chartDimensions.radius
        }
        colorScale={[
          "#6A994E",
          "#A7C957",
          "#1B9AAA",
          "#E3651D",
          "#F4A259",
          "#FF6F59",
          "#FFD639",
          "#72B4A3",
          "#A7D3A6",
          "#D4A5A5",
        ]}
        width={chartDimensions.width}
        height={chartDimensions.height}
        events={[
          {
            target: "data",
            eventHandlers: {
              onClick: (event, props) => {
                handleSliceClick(props.datum, props.index)
              },
            },
          },
        ]}
      />

      {selectedCategoryInfo && (
        <div
          style={{
            fontSize: "12px",
            width: "100%",
            marginTop: "10px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
            padding: "5px",
          }}
        >
          <p>
            <strong>Category:</strong> {selectedCategoryInfo.category}
          </p>
          <p>
            <strong>Percentage:</strong> {selectedCategoryInfo.percentage}%
          </p>
          <p>
            <strong>Frequency:</strong> {selectedCategoryInfo.frequency}
          </p>
        </div>
      )}
    </div>
  )
}

export default VisualCategories
