import { FC } from "react"
import { trpc } from "../utils/trpc"

const dashboard: FC = ({}) => {
  const { mutate } = trpc.admin.sensitive.useMutation()

  return (
    <div>
      Dashboard
      <button type="button" onClick={() => mutate()}>
        TOP SECRET ACTION
      </button>
    </div>
  )
}

export default dashboard
