import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { ProjectState } from "./project.state";
import { SetProjectList } from "./actions/set-project-list";
import { DeleteProject } from "./actions/delete-project";
import { AddProject } from "./actions/add-project";
import { Observable } from "rxjs";
import { IProject } from "src/app/interfaces/project.interface";



@Injectable({
    providedIn: "root"
})
export class ProjectStateFacade {

    @Select(ProjectState.projectList)
    projectList$: Observable<IProject[]>;

    constructor(private store: Store) {}

    setProjectList(): Observable<void> {
        return this.store.dispatch(new SetProjectList());
    }

    addProject(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddProject(name, description));
    }

    deleteProject(projectId: number): Observable<void> {
        return this.store.dispatch(new DeleteProject(projectId))
    }
}
