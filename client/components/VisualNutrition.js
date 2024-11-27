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
