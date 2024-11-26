import React, { useEffect, useState } from "react"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryGroup,
  VictoryLine,
  VictoryLegend,
} from "victory"
import { useSelector, useDispatch } from "react-redux"
import { fetchShoppingListHistory } from "../store/ShoppingList"

const listNutritionGraph = () => {
  const dispatch = useDispatch()
  const { id } = useSelector((state) => state.auth)
  const { shoppingHistory } = useSelector((state) => state.shoppingList)
  const [groupedData, setGroupedData] = useState([])

  useEffect(() => {
    dispatch(fetchShoppingListHistory(id))
  }, [])

  let shoppingHistoryData = shoppingHistory || []
  useEffect(() => {
    function groupShoppingHistoryNutrition(shoppingHistoryData) {
      const listNutrition = {}
      shoppingHistoryData.map((list) => {
        const date =
          list.checkoutDate.split(", ")[1] +
          " " +
          list.createdAt.split("T")[1].slice(0, 5)
        listNutrition[date] = [0, 0, 0]
        list.ingredients.map((ingredient) => {
          listNutrition[date][0] += Number(ingredient.fatsPerUnit)
          listNutrition[date][1] += Number(ingredient.proteinPerUnit)
          listNutrition[date][2] += Number(ingredient.carbsPerUnit)
        })
      })

      const nutritionCategories = [
        "fatsPerUnit",
        "proteinPerUnit",
        "carbsPerUnit",
      ]
      return nutritionCategories.map((nutrition, i) => {
        return Object.keys(listNutrition).map((date) => {
          return {
            x: date,
            y: listNutrition[date][i],
            nutrition: nutrition,
          }
        })
      })
    }
    if (shoppingHistory) {
      shoppingHistoryData =
        shoppingHistory.length > 4 ? shoppingHistory.slice(-4) : shoppingHistory
      setGroupedData(groupShoppingHistoryNutrition(shoppingHistoryData))
    }
  }, [shoppingHistory])

  return (
    <div style={{ height: "600px" }}>
      <VictoryChart
        domainPadding={{ x: 20 }}
        height={500}
        width={700}
        animate={{ duration: 500 }}
      >
        <VictoryLegend
          x={600}
          y={20}
          title="Legend"
          centerTitle
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
          data={[
            { name: "Fats", symbol: { fill: "tomato" } },
            { name: "Protein", symbol: { fill: "orange" } },
            { name: "Carbs", symbol: { fill: "gold" } },
          ]}
        />
        <VictoryLabel
          text="Nutrition of Shopping Lists"
          x={350}
          y={-20}
          textAnchor="middle"
          style={{ fontSize: 25 }}
        />
        <VictoryAxis
          axisLabelComponent={<VictoryLabel />}
          label={"Shopping List"}
          crossAxis
          style={{
            tickLabels: {
              angle: -45,
              fontSize: 10,
              textAnchor: "end",
              padding: 2,
            },
            axisLabel: {
              label: "Shopping List",
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 20,
              // padding: 40,
              padding: 100,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<VictoryLabel />}
          label={"Grams"}
          tickFormat={(t) => (Number.isInteger(t) ? t : null)}
          style={{
            tickLabels: { fontSize: 10 },
            axisLabel: {
              label: "Grams",
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 20,
              padding: 30,
            },
          }}
        />
        <VictoryGroup offset={10} colorScale={["tomato", "orange", "gold"]}>
          {groupedData.map((list, i) => (
            <VictoryBar
              key={i}
              data={list}
              barWidth={10}
              style={{ data: { stroke: "#c43a31" } }}
            ></VictoryBar>
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  )
}

export default listNutritionGraph
