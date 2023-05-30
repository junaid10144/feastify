import type { categories } from "n/constants/config"

type DateTime = {
  justDate: Date | null
  dateTime: Date | null
}

type Categories = (typeof categories)[number]
