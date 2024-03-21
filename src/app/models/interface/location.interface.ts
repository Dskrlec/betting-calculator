import { League } from "./league.interface"

export interface Location {
    id: string
    name: string
    leagues: League[]
    order: number
  }