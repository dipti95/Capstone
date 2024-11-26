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
    <div style={{ height: "650px", width: "100%", overflowX: "auto" }}>
      <VictoryChart
        domainPadding={{ x: 50, y: 20 }}
        height={500}
        width={800}
        animate={{
          duration: 2000,
        }}
        theme={VictoryTheme.material}
      >
        <VictoryLegend
          x={600}
          y={50}
          orientation="vertical"
          gutter={20}
          style={{
            border: { stroke: "black" },
            title: { fontSize: 20 },
          }}
          data={[
            { name: "Calories", symbol: { fill: "tomato" } },
            { name: "Fats", symbol: { fill: "orange" } },
            { name: "Protein", symbol: { fill: "gold" } },
            { name: "Carbs", symbol: { fill: "cyan" } },
          ]}
        />
        <VictoryLabel
          text="Nutrient Content of Foods by Category"
          x={400}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 25, padding: 100 }}
        />
        <VictoryAxis
          label="Food Categories"
          style={{
            tickLabels: {
              angle: -45,
              fontSize: 10,
              textAnchor: "end",
              padding: 15,
            },
            axisLabel: {
              fontSize: 20,
              padding: 100,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Amount (grams)"
          tickFormat={(t) => (Number.isInteger(t) ? t : null)}
          style={{
            tickLabels: { fontSize: 10 },
            axisLabel: {
              fontSize: 20,
              padding: 35,
            },
          }}
        />
        <VictoryStack colorScale={["tomato", "orange", "gold", "cyan"]}>
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
