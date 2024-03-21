import { Fixture } from "./fixture.interface"
import { Market } from "./market.interface"

export interface Event {
    isLive: boolean
    sportId: string
    id: string
    linkedId: string
    providerId: string
    betCode: string
    fixture: Fixture
    markets: Market[]
    topLeagues: any[]
    marketsTotal: number
    isHighlighted: boolean
    willBeLive: boolean
    picksTotal: number
    settlementsLocked: boolean
  }