import { League2 } from "./league2.interface"
import { Participant } from "./participant.interface"

export interface Fixture {
    startDate: string
    type: string
    participants: Participant[]
    league?: League2
    status: string
  }