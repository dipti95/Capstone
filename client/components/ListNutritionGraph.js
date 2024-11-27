import React, { useEffect, useState } from "react"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryGroup,
  VictoryLegend,
} from "victory"
import { useSelector, useDispatch } from "react-redux"
import { fetchShoppingListHistory } from "../store/ShoppingList"

const ListNutritionGraph = () => {
  const dispatch = useDispatch()
  const { id } = useSelector((state) => state.auth)
  const { shoppingHistory } = useSelector((state) => state.shoppingList)
  const [groupedData, setGroupedData] = useState([])

  useEffect(() => {
    dispatch(fetchShoppingListHistory(id))
  }, [dispatch, id])

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
    <div style={{ height: "600px", padding: "10px" }}>
      <VictoryChart
        domainPadding={{ x: 40 }}
        height={500}
        width={700}
        animate={{ duration: 500 }}
        padding={{ top: 80, bottom: 120, left: 100, right: 50 }} // Adjusted padding
      >
        <VictoryLegend
          // x={400} // Shifted legend slightly to the right
          // y={40} // Positioned below the title
          // title="Legend"
          // orientation="verticle" // Horizontal layout
          // gutter={10} // Reduced spacing between items
          // // style={{
          // //   border: { stroke: "black", strokeWidth: 1 },
          // //   title: { fontSize: 14 }, // Smaller title font
          // //   labels: { fontSize: 12 }, // Smaller label font
          // // }}
          // style={{
          //   border: { stroke: "black" },
          //   title: { fontSize: 12 },
          // }}
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
            { name: "Fats", symbol: { fill: "#750E21", type: "square" } },
            { name: "Protein", symbol: { fill: "#BED754", type: "square" } },
            { name: "Carbs", symbol: { fill: "#E3651D", type: "square" } },
          ]}
        />
        <VictoryLabel
          text="Nutrition of Shopping Lists"
          x={350}
          y={20} // Adjusted position for better spacing
          textAnchor="middle"
          style={{ fontSize: 20 }}
        />
        <VictoryAxis
          axisLabelComponent={<VictoryLabel />}
          label="Shopping List"
          crossAxis
          style={{
            tickLabels: {
              angle: -60, // Rotated for better readability
              fontSize: 10,
              textAnchor: "end",
              padding: 10, // Space between labels and axis
            },
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 16,
              padding: 90, // Space between label and tick labels
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<VictoryLabel />}
          label="Grams"
          tickFormat={(t) => (Number.isInteger(t) ? t : null)}
          style={{
            tickLabels: { fontSize: 10 },
            axisLabel: {
              fontFamily: "inherit",
              fontWeight: 100,
              letterSpacing: "1px",
              fontSize: 16,
              padding: 70, // Ensures label visibility
              angle: -90, // Rotated for alignment
              textAnchor: "middle",
            },
          }}
        />
        <VictoryGroup
          offset={15} // Adjusted for better spacing between bars
          colorScale={["#750E21", "#BED754", "#E3651D"]}
        >
          {groupedData.map((list, i) => (
            <VictoryBar
              key={i}
              data={list}
              barWidth={12} // Adjusted bar width for better clarity
              style={{ data: { stroke: "#c43a31" } }}
            />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  )
}

export default ListNutritionGraph
