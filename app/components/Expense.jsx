import { TrendingDown } from "lucide-react"

export default function Expense({ money }) {
  return (
    <div className="flex space-x-4 items-center bg-white border-r-4 border-r-red-600 p-4 shadow-md rounded-md">
      <TrendingDown size={48} color="red" />
      <div>
        <h3 className="text-lg">Expense</h3>
        <p className="text-xl font-bold">{money}</p>
      </div>
    </div>
  )
}
