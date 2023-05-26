import { categories } from "n/constants/config"
export type DateTime = {
  justDate: Date | null
  dateTime: Date | null
}

type Categories = (typeof categories)[number]
