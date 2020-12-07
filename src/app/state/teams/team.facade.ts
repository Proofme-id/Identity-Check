import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { TeamState } from "./team.state";
import { SetTeamList } from "./actions/set-team-list";
import { DeleteTeam } from "./actions/delete-team";
import { AddTeam } from "./actions/add-team";
import { Observable } from "rxjs";
import { ITeam } from "src/app/interfaces/team.interface";



@Injectable({
    providedIn: "root"
})
export class TeamStateFacade {

    @Select(TeamState.teamList)
    teamList$: Observable<ITeam[]>;

    constructor(private store: Store) {}

    setTeamList(): Observable<void> {
        return this.store.dispatch(new SetTeamList());
    }

    addTeam(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddTeam(name, description));
    }

    deleteTeam(teamId: number): Observable<void> {
        return this.store.dispatch(new DeleteTeam(teamId))
    }
}
