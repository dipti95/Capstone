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
