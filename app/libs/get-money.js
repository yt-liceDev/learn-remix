export function getMoney(data, type) {
  return data.reduce((total, curr) => {
    const category = curr.category.name
    if (type === "balance") {
      if (category === "income") return (total += curr.money)
      total -= curr.money
    }

    if (type === "income" && category === "income") {
      total += curr.money
    }

    if (type === "expense" && category === "expense") {
      total -= curr.money
    }

    return total
  }, 0)
}
