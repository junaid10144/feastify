import { FC } from "react"
import Link from "next/link"

const dashboard: FC = ({}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-8 font-medium">
      <Link className="rounded-md bg-gray-100 p-2" href="/dashboard/opening">
        Opening hours
      </Link>
      <Link className="rounded-md bg-gray-100 p-2" href="/dashboard/menu">
        Menu
      </Link>
    </div>
  )
}

export default dashboard
