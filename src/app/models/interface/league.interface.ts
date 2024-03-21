import { EventDateGroup } from "./event-date-group.interface"

export interface League {
    id: string
    name: string
    iconId: string
    eventId: string
    linkedId: string
    providerId: string
    betCode: string
    startDate: string
    endDate: string
    eventDateGroups: EventDateGroup[]
    eventless: boolean
    seasonOriented: boolean
    order: number
  }