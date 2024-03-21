import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import * as jsonData from '../../assets/data.json';
import { Market } from "../models/interface/market.interface";
import { MatchEvent } from "../models/interface/match-event.interface";
import { CommonModule, DatePipe } from "@angular/common";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { Participant } from "../models/interface/participant.interface";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormatOddsPipe } from '../../utils/pipes/formatOddsPipe';
import { LeagueMatchGroup } from '../models/interface/league-match-group.interface';
import { SelectedItem } from '../models/interface/selected-item.interface';
import { MatchData } from '../models/interface/match-data.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, DatePipe, FormatOddsPipe, CommonModule, MatIconModule, MatIconButton, MatIcon, MatDivider, MatFormFieldModule, MatInputModule, FormsModule,],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['matchTime', 'odds_1', 'odds_x', 'odds_2', 'odds_12', 'odds_1x', 'odds_x2'];
  leagueMatchGroups: LeagueMatchGroup[] = [];
  selectedItems: SelectedItem[] = [];
  oddsSum: number = 0
  payout: number = 0
  amount: number = 0
  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.groupMatchesByLeagueAndDate();
  }

  groupMatchesByLeagueAndDate(): void {
    const leagueGroups: { [league: string]: { [date: string]: MatchData[] } } = {};

    jsonData.locations.forEach(location => {
      location.leagues.forEach(league => {
        if (!leagueGroups[league.name]) {
          leagueGroups[league.name] = {};
        }
        league.eventDateGroups.forEach(eventDateGroup => {
          const dateStr = new Date(eventDateGroup.date).toLocaleDateString();

          if (!leagueGroups[league.name][dateStr]) {
            leagueGroups[league.name][dateStr] = [];
          }
          eventDateGroup.events.forEach(event => {
            leagueGroups[league.name][dateStr].push(this.createMatchData(event));
          });
        });
      });
    });

    this.leagueMatchGroups = Object.keys(leagueGroups).map(leagueName => {
      const dateGroups = Object.keys(leagueGroups[leagueName]).map(date => ({
        date: date,
        matches: leagueGroups[leagueName][date].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        leagueName: leagueName,
        dateGroups: dateGroups
      };
    });
  }

  createMatchData(event: MatchEvent): MatchData {
    const basicOfferMarket = event.markets.find((m: Market) => m.name === 'Osnovna ponuda');
    const doubleChanceMarket = event.markets.find((m: Market) => m.name === 'Dupla šansa');

    return {
      id: event.id,
      date: event.fixture.startDate,
      match: event.fixture.participants.map((p: Participant) => p.name).join(' - '),
      odds_1: this.findOdds(basicOfferMarket, '1'),
      odds_x: this.findOdds(basicOfferMarket, 'x'),
      odds_2: this.findOdds(basicOfferMarket, '2'),
      odds_12: this.findOdds(doubleChanceMarket, '12'),
      odds_1x: this.findOdds(doubleChanceMarket, '1x'),
      odds_x2: this.findOdds(doubleChanceMarket, 'x2'),
    };
  }

  findOdds(market: Market | undefined, pickName: string): number | undefined {
    return market?.picks.find(pick => pick.name === pickName)?.odds;
  }

  showSelectedOdd(match: MatchData, oddKey: keyof MatchData, type: 'Osnovna ponuda' | 'Dupla šansa'): void {
    if (this.selectedItems.length >= 8) {
      this.openSnackBar("Maximum 8 matches can be selected");
      return;
    }
    const existingIndex = this.selectedItems.findIndex(item => item.matchId === match.id);
    if (existingIndex !== -1) {
      if (this.selectedItems[existingIndex].type === type && this.selectedItems[existingIndex].odd === match[oddKey]) {
        this.selectedItems.splice(existingIndex, 1);
      } else {
        this.selectedItems[existingIndex] = {
          matchId: match.id,
          match: match.match,
          odd: match[oddKey] as number,
          date: match.date,
          type: type,
          oddKey: oddKey
        };
      }
    } else {
      this.selectedItems.push({
        matchId: match.id,
        match: match.match,
        odd: match[oddKey] as number,
        date: match.date,
        type: type,
        oddKey: oddKey
      });
    }
    this.getTotals();
  }

  removeSelectedOdd(selection: { match: string, odd: number }): void {
    const index = this.selectedItems.findIndex(item => item === selection);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
    this.getTotals()
  }

  isSelected(match: MatchData, type: 'Osnovna ponuda' | 'Dupla šansa', odds: number): boolean {
    return this.selectedItems.some(item => item.match === match.match && item.date === match.date && item.type === type && item.odd === odds);
  }

  getTotals(): void {
    this.oddsSum = this.selectedItems.reduce((a, item) => a * item.odd, 1)
    this.payout = this.amount * this.oddsSum
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
