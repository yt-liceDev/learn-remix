import { Wallet } from "lucide-react"

export default function Balance({ money }) {
  return (
    <div className="flex space-x-4 items-center bg-white border-r-4 border-r-blue-600 p-4 shadow-md rounded-md">
      <Wallet size={48} />
      <div>
        <h3 className="text-lg">Balance</h3>
        <p className="text-xl font-bold">{money}</p>
      </div>
    </div>
  )
}
