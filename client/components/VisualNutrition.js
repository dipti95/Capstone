// import React, { useEffect, useState, useRef } from "react"
// import {
//   VictoryChart,
//   VictoryBar,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
//   VictoryStack,
//   VictoryLegend,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { getFoods } from "../store/foods"

// const VisualNutrition = () => {
//   const { foods } = useSelector((state) => state)
//   const dispatch = useDispatch()
//   const didMount = useRef(false)
//   const [didLoad, setDidLoad] = useState(false)

//   useEffect(() => {
//     dispatch(getFoods())
//   }, [dispatch])

//   useEffect(() => {
//     if (didMount.current) {
//       setDidLoad(true)
//     } else {
//       didMount.current = true
//     }
//   }, [foods])

//   const safeFoods = Array.isArray(foods) ? foods : []

//   const groupedData = React.useMemo(() => {
//     if (!safeFoods.length) return []

//     const categories = {}
//     safeFoods
//       .filter((food) => food.category && food.category !== "miscellaneous")
//       .forEach((food) => {
//         const category = food.category.trim().toLowerCase()

//         if (!categories[category]) {
//           categories[category] = {
//             category: food.category,
//             calories: 0,
//             fats: 0,
//             protein: 0,
//             carbs: 0,
//           }
//         }

//         categories[category].calories += Number(food.caloriesPerUnit) || 0
//         categories[category].fats += Number(food.fatsPerUnit) || 0
//         categories[category].protein += Number(food.proteinPerUnit) || 0
//         categories[category].carbs += Number(food.carbsPerUnit) || 0
//       })

//     return Object.values(categories)
//   }, [safeFoods])

//   const caloriesData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.calories,
//   }))
//   const fatsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.fats,
//   }))
//   const proteinData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.protein,
//   }))
//   const carbsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.carbs,
//   }))

//   return didLoad ? (
//     // <div style={{ height: "650px", width: "100%", overflowX: "auto" }}>
//     <div style={{ height: "600px" }}>
//       <VictoryChart
//         //domainPadding={{ x: 50, y: 20 }}
//         domainPadding={{ x: 20 }}
//         height={500}
//         width={700}
//         animate={{
//           duration: 500,
//         }}
//         theme={VictoryTheme.material}
//       >
//         <VictoryLegend
//           x={600}
//           // y={50}
//           y={20}
//           title="Legend"
//           //---
//           orientation="vertical"
//           gutter={20}
//           style={{
//             border: { stroke: "black" },
//             title: { fontSize: 20 },
//           }}
//           // data={[
//           //   { name: "Calories", symbol: { fill: "#191A19" } },
//           //   { name: "Fats", symbol: { fill: "#1E5128" } },
//           //   { name: "Protein", symbol: { fill: "#4E9F3D" } },
//           //   { name: "Carbs", symbol: { fill: "#D8E9A8" } },
//           // ]}
//           data={[
//             { name: "Calories", symbol: { fill: "#D8E9A8" } },
//             { name: "Fats", symbol: { fill: "#4E9F3D" } },
//             { name: "Protein", symbol: { fill: "#1E5128" } },
//             { name: "Carbs", symbol: { fill: "#191A19" } },
//           ]}
//         />
//         <VictoryLabel
//           text="Nutrient Content of Foods by Category"
//           // x={400}
//           // y={30}
//           // textAnchor="middle"
//           // style={{ fontSize: 25, padding: 100 }}
//           x={350}
//           y={-20}
//           textAnchor="middle"
//           style={{ fontSize: 25 }}
//         />
//         <VictoryAxis
//           label={"Food Categories"}
//           crossAxis
//           style={{
//             tickLabels: {
//               angle: -45,
//               fontSize: 10,
//               textAnchor: "end",
//               // padding: 15,
//               padding: 2,
//             },
//             axisLabel: {
//               label: "Food Categories",
//               fontFamily: "inherit",
//               fontWeight: 100,
//               fontSize: 20,

//               padding: 100,
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           label="Amount (grams)"
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           // style={{
//           //   tickLabels: { fontSize: 10 },
//           //   axisLabel: {
//           //     fontSize: 20,
//           //     padding: 35,
//           //   },
//           // }}
//           style={{
//             tickLabels: { fontSize: 10 },
//             axisLabel: {
//               label: "Grams",
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 20,
//               padding: 30,
//             },
//           }}
//         />

//         {/* <VictoryStack colorScale={["#191A19", "#1E5128", "#4E9F3D", "#D8E9A8"]}> */}
//         <VictoryStack colorScale={["#D8E9A8", "#4E9F3D", "#1E5128", "#191A19"]}>
//           <VictoryBar data={caloriesData} />
//           <VictoryBar data={fatsData} />
//           <VictoryBar data={proteinData} />
//           <VictoryBar data={carbsData} />
//         </VictoryStack>
//       </VictoryChart>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   )
// }

// export default VisualNutrition

// import React, { useEffect, useState, useRef } from "react"
// import {
//   VictoryChart,
//   VictoryBar,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
//   VictoryStack,
//   VictoryLegend,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { getFoods } from "../store/foods"

// const VisualNutrition = () => {
//   const { foods } = useSelector((state) => state)
//   const dispatch = useDispatch()
//   const didMount = useRef(false)
//   const [didLoad, setDidLoad] = useState(false)
//   const [chartDimensions, setChartDimensions] = useState({
//     width: 600,
//     height: 400,
//   })

//   useEffect(() => {
//     dispatch(getFoods())
//   }, [dispatch])

//   useEffect(() => {
//     if (didMount.current) {
//       setDidLoad(true)
//     } else {
//       didMount.current = true
//     }
//   }, [foods])

//   useEffect(() => {
//     const handleResize = () => {
//       const width = Math.min(window.innerWidth * 0.9, 700) // 90% of screen width, max 700px
//       const height = Math.min(window.innerHeight * 0.6, 500) // 60% of screen height, max 500px
//       setChartDimensions({ width, height })
//     }

//     handleResize() // Set initial dimensions
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   const safeFoods = Array.isArray(foods) ? foods : []

//   const groupedData = React.useMemo(() => {
//     if (!safeFoods.length) return []

//     const categories = {}
//     safeFoods
//       .filter((food) => food.category && food.category !== "miscellaneous")
//       .forEach((food) => {
//         const category = food.category.trim().toLowerCase()

//         if (!categories[category]) {
//           categories[category] = {
//             category: food.category,
//             calories: 0,
//             fats: 0,
//             protein: 0,
//             carbs: 0,
//           }
//         }

//         categories[category].calories += Number(food.caloriesPerUnit) || 0
//         categories[category].fats += Number(food.fatsPerUnit) || 0
//         categories[category].protein += Number(food.proteinPerUnit) || 0
//         categories[category].carbs += Number(food.carbsPerUnit) || 0
//       })

//     return Object.values(categories)
//   }, [safeFoods])

//   const caloriesData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.calories,
//   }))
//   const fatsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.fats,
//   }))
//   const proteinData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.protein,
//   }))
//   const carbsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.carbs,
//   }))

//   return didLoad ? (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         padding: "10px",
//       }}
//     >
//       <VictoryChart
//         domainPadding={{ x: 20 }}
//         height={chartDimensions.height}
//         width={chartDimensions.width}
//         animate={{
//           duration: 500,
//         }}
//         theme={VictoryTheme.material}
//       >
//         <VictoryLegend
//           x={chartDimensions.width - 200}
//           y={20}
//           title="Legend"
//           orientation="vertical"
//           gutter={20}
//           style={{
//             border: { stroke: "black" },
//             title: { fontSize: Math.min(chartDimensions.width / 35, 16) },
//           }}
//           data={[
//             { name: "Calories", symbol: { fill: "#D8E9A8" } },
//             { name: "Fats", symbol: { fill: "#4E9F3D" } },
//             { name: "Protein", symbol: { fill: "#1E5128" } },
//             { name: "Carbs", symbol: { fill: "#191A19" } },
//           ]}
//         />
//         <VictoryLabel
//           text="Nutrient Content of Foods by Category"
//           x={chartDimensions.width / 2}
//           y={30}
//           textAnchor="middle"
//           style={{ fontSize: Math.min(chartDimensions.width / 20, 18) }}
//         />
//         <VictoryAxis
//           label={"Food Categories"}
//           crossAxis
//           style={{
//             tickLabels: {
//               angle: -45,
//               fontSize: Math.min(chartDimensions.width / 40, 10),
//               textAnchor: "end",
//               padding: 2,
//             },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               fontSize: Math.min(chartDimensions.width / 30, 14),
//               padding: 40,
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           label="Amount (grams)"
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           style={{
//             tickLabels: { fontSize: Math.min(chartDimensions.width / 40, 10) },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               fontSize: Math.min(chartDimensions.width / 30, 14),
//               padding: 30,
//             },
//           }}
//         />
//         <VictoryStack colorScale={["#D8E9A8", "#4E9F3D", "#1E5128", "#191A19"]}>
//           <VictoryBar data={caloriesData} />
//           <VictoryBar data={fatsData} />
//           <VictoryBar data={proteinData} />
//           <VictoryBar data={carbsData} />
//         </VictoryStack>
//       </VictoryChart>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   )
// }

// export default VisualNutrition

// -------------------
//---------------------
//----------Final One is below

// import React, { useEffect, useState, useRef } from "react"
// import {
//   VictoryChart,
//   VictoryBar,
//   VictoryAxis,
//   VictoryTheme,
//   VictoryLabel,
//   VictoryStack,
//   VictoryLegend,
// } from "victory"
// import { useSelector, useDispatch } from "react-redux"
// import { getFoods } from "../store/foods"

// const VisualNutrition = () => {
//   const { foods } = useSelector((state) => state)
//   const dispatch = useDispatch()
//   const didMount = useRef(false)
//   const [didLoad, setDidLoad] = useState(false)
//   const [chartDimensions, setChartDimensions] = useState({
//     width: 700,
//     height: 500,
//   })

//   useEffect(() => {
//     dispatch(getFoods())
//   }, [dispatch])

//   useEffect(() => {
//     if (didMount.current) {
//       setDidLoad(true)
//     } else {
//       didMount.current = true
//     }
//   }, [foods])

//   useEffect(() => {
//     const handleResize = () => {
//       const width = Math.min(window.innerWidth * 0.9, 800) // 90% of screen width, max 800px
//       const height = Math.min(window.innerHeight * 0.6, 500) // 60% of screen height, max 500px
//       setChartDimensions({ width, height })
//     }

//     handleResize() // Set initial dimensions
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   const safeFoods = Array.isArray(foods) ? foods : []

//   const groupedData = React.useMemo(() => {
//     if (!safeFoods.length) return []

//     const categories = {}
//     safeFoods
//       .filter((food) => food.category && food.category !== "miscellaneous")
//       .forEach((food) => {
//         const category = food.category.trim().toLowerCase()

//         if (!categories[category]) {
//           categories[category] = {
//             category: food.category,
//             calories: 0,
//             fats: 0,
//             protein: 0,
//             carbs: 0,
//           }
//         }

//         categories[category].calories += Number(food.caloriesPerUnit) || 0
//         categories[category].fats += Number(food.fatsPerUnit) || 0
//         categories[category].protein += Number(food.proteinPerUnit) || 0
//         categories[category].carbs += Number(food.carbsPerUnit) || 0
//       })

//     return Object.values(categories)
//   }, [safeFoods])

//   const caloriesData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.calories,
//   }))
//   const fatsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.fats,
//   }))
//   const proteinData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.protein,
//   }))
//   const carbsData = groupedData.map((data) => ({
//     x: data.category,
//     y: data.carbs,
//   }))

//   return didLoad ? (
//     <div
//       // style={{
//       //   display: "flex",
//       //   flexDirection: "column",
//       //   justifyContent: "center",
//       //   alignItems: "center",
//       //   height: "100%",
//       //   padding: "10px",
//       // }}
//       style={{ height: "600px", padding: "10px" }}
//     >
//       <VictoryChart
//         // domainPadding={{ x: 60 }}
//         domainPadding={{ x: 40 }}
//         height={chartDimensions.height}
//         width={chartDimensions.width}
//         animate={{
//           duration: 500,
//         }}
//         theme={VictoryTheme.material}
//         // padding={{ top: 60, bottom: 120, left: 100, right: 50 }} // Adjusted padding
//         padding={{ top: 80, bottom: 120, left: 100, right: 50 }}
//       >
//         <VictoryLegend
//           x={chartDimensions.width - 200}
//           y={20}
//           title="Legend"
//           orientation="vertical"
//           gutter={20}
//           style={{
//             border: { stroke: "black" },
//             title: { fontSize: Math.min(chartDimensions.width / 35, 16) },
//           }}
//           data={[
//             { name: "Calories", symbol: { fill: "#D8E9A8" } },
//             { name: "Fats", symbol: { fill: "#4E9F3D" } },
//             { name: "Protein", symbol: { fill: "#1E5128" } },
//             { name: "Carbs", symbol: { fill: "#191A19" } },
//           ]}
//         />
//         <VictoryLabel
//           text="Nutrient Content of Foods by Category"
//           x={chartDimensions.width / 2}
//           // y={30}
//           y={20}
//           textAnchor="middle"
//           // style={{ fontSize: Math.min(chartDimensions.width / 20, 18) }}
//           style={{ fontSize: 20 }}
//         />
//         <VictoryAxis
//           label="Food Categories"
//           crossAxis
//           // style={{
//           //   tickLabels: {
//           //     angle: -60, // Rotate labels for readability
//           //     fontSize: Math.min(chartDimensions.width / 40, 10),
//           //     textAnchor: "end",
//           //     padding: 5, // Spacing between labels and axis
//           //   },
//           //   axisLabel: {
//           //     fontFamily: "inherit",
//           //     fontWeight: 100,
//           //     fontSize: Math.min(chartDimensions.width / 30, 14),
//           //     padding: 100, // Ensure label doesn't overlap with ticks
//           //   },
//           // }}

//           style={{
//             tickLabels: {
//               angle: -60, // Rotated for better readability
//               fontSize: 10,
//               textAnchor: "end",
//               padding: 10, // Space between labels and axis
//             },
//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 90, // Space between label and tick labels
//             },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           label="Amount (grams)"
//           tickFormat={(t) => (Number.isInteger(t) ? t : null)}
//           style={{
//             //tickLabels: { fontSize: Math.min(chartDimensions.width / 40, 10) },
//             tickLabels: { fontSize: 10 },
//             // axisLabel: {
//             //   fontFamily: "inherit",
//             //   fontWeight: 100,
//             //   fontSize: Math.min(chartDimensions.width / 30, 14),
//             //   padding: 80, // Ensure label is fully visible
//             //   angle: -90, // Rotate the label
//             //   textAnchor: "middle",
//             // },

//             axisLabel: {
//               fontFamily: "inherit",
//               fontWeight: 100,
//               letterSpacing: "1px",
//               fontSize: 16,
//               padding: 70, // Ensures label visibility
//               angle: -90, // Rotated for alignment
//               textAnchor: "middle",
//             },
//           }}
//         />
//         <VictoryStack colorScale={["#D8E9A8", "#4E9F3D", "#1E5128", "#191A19"]}>
//           <VictoryBar data={caloriesData} />
//           <VictoryBar data={fatsData} />
//           <VictoryBar data={proteinData} />
//           <VictoryBar data={carbsData} />
//         </VictoryStack>
//       </VictoryChart>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   )
// }

// export default VisualNutrition

import React, { useEffect, useState, useRef } from "react"
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryStack,
  VictoryLegend,
} from "victory"
import { useSelector, useDispatch } from "react-redux"
import { getFoods } from "../store/foods"

const VisualNutrition = () => {
  const { foods } = useSelector((state) => state)
  const dispatch = useDispatch()
  const didMount = useRef(false)
  const [didLoad, setDidLoad] = useState(false)

  useEffect(() => {
    dispatch(getFoods())
  }, [dispatch])

  useEffect(() => {
    if (didMount.current) {
      setDidLoad(true)
    } else {
      didMount.current = true
    }
  }, [foods])

  const safeFoods = Array.isArray(foods) ? foods : []

  const groupedData = React.useMemo(() => {
    if (!safeFoods.length) return []

    const categories = {}
    safeFoods
      .filter((food) => food.category && food.category !== "miscellaneous")
      .forEach((food) => {
        const category = food.category.trim().toLowerCase()

        if (!categories[category]) {
          categories[category] = {
            category: food.category,
            calories: 0,
            fats: 0,
            protein: 0,
            carbs: 0,
          }
        }

        categories[category].calories += Number(food.caloriesPerUnit) || 0
        categories[category].fats += Number(food.fatsPerUnit) || 0
        categories[category].protein += Number(food.proteinPerUnit) || 0
        categories[category].carbs += Number(food.carbsPerUnit) || 0
      })

    return Object.values(categories)
  }, [safeFoods])

  const caloriesData = groupedData.map((data) => ({
    x: data.category,
    y: data.calories,
  }))
  const fatsData = groupedData.map((data) => ({
    x: data.category,
    y: data.fats,
  }))
  const proteinData = groupedData.map((data) => ({
    x: data.category,
    y: data.protein,
  }))
  const carbsData = groupedData.map((data) => ({
    x: data.category,
    y: data.carbs,
  }))

  return didLoad ? (
    <div style={{ height: "600px", padding: "10px" }}>
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={500}
        width={700}
        animate={{ duration: 500 }}
        padding={{ top: 80, bottom: 120, left: 100, right: 100 }}
      >
        {/* Legend */}
        <VictoryLegend
          x={550} // Adjusted for alignment
          y={20}
          title="Legend"
          centerTitle
          orientation="vertical"
          gutter={20}
          style={{
            border: { stroke: "black" },
            title: { fontSize: 16 },
          }}
          data={[
            { name: "Calories", symbol: { fill: "#D8E9A8" } },
            { name: "Fats", symbol: { fill: "#4E9F3D" } },
            { name: "Protein", symbol: { fill: "#1E5128" } },
            { name: "Carbs", symbol: { fill: "#191A19" } },
          ]}
        />

        {/* Title */}
        <VictoryLabel
          text="Nutrient Content of Foods by Category"
          x={350}
          y={20}
          textAnchor="middle"
          style={{ fontSize: 20 }}
        />

        {/* X Axis */}
        <VictoryAxis
          label="Food Categories"
          style={{
            tickLabels: {
              angle: -45,
              fontSize: 10,
              textAnchor: "end",
              padding: 5,
            },
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 16,
              padding: 100,
            },
          }}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          label="Amount (grams)"
          tickValues={[0, 10000, 20000, 30000, 40000]} // 5 marks on Y axis
          style={{
            tickLabels: { fontSize: 10 },
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 16,
              padding: 70,
              angle: -90,
              textAnchor: "middle",
            },
          }}
        />

        {/* Bars */}
        <VictoryStack colorScale={["#D8E9A8", "#4E9F3D", "#1E5128", "#191A19"]}>
          <VictoryBar data={caloriesData} />
          <VictoryBar data={fatsData} />
          <VictoryBar data={proteinData} />
          <VictoryBar data={carbsData} />
        </VictoryStack>
      </VictoryChart>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default VisualNutrition
