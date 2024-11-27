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
      const width = window.innerWidth * 0.4
      const height = Math.min(width, 300)
      const radius = Math.min(width / 3, 100)
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
