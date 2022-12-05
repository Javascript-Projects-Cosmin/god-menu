import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor() {
    }


    loadingOn() {
        this.loadingSubject.next(true)
    }

    loadingOff(){
        this.loadingSubject.next(false);
    }
}
