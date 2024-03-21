import { Picks } from "./picks.interface"

export interface Market {
  marketId: string
  betCode: string
  bl: number
  name: string
  picks: Picks[]
  order: number
  isValid: boolean
}