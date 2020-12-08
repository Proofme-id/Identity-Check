/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router"
import "rxjs/add/operator/catch";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/take";
import { UserStateFacade } from "../state/user/user.facade";
import { UserState } from "../state/user/user.state";



@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private store: Store,
                private userStateFacade: UserStateFacade,
                private router: Router) { }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     request = this.addToken(request);
    //     return next.handle(request);
    // }

    private refreshTokenInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addAuthenticationToken(request);

        return next.handle(request).catch(error => {
            // We don't want to refresh token for some requests like login or refresh token itself
            // So we verify url and we throw an error if it's the case
            if (
                request.url.includes("refresh") ||
                request.url.includes("login")
            ) {
                // We do another check to see if refresh token failed
                // In this case we want to logout user and to redirect it to login page
                if (request.url.includes("refresh")) {
                    this.userStateFacade.logout();
                    this.router.navigate(["login"]);
                }
                return throwError(error);
            }
            // If error status is different than 401 we want to skip refresh token
            // So we check that and throw the error if it's the case
            if (error.status !== 401) {
                return throwError(error);
            }
            if (this.refreshTokenInProgress) {
                // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                // – which means the new token is ready and we can retry the request again
                return this.refreshTokenSubject
                    .filter(result => result !== null)
                    .take(1)
                    .switchMap(() => next.handle(this.addAuthenticationToken(request)));
            } else {
                this.refreshTokenInProgress = true;
                // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                this.refreshTokenSubject.next(null);
                // Call auth.refreshAccessToken(this is an Observable that will be returned)
                return this.userStateFacade.refresh()
                    .switchMap((token: any) => {
                        // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                        // for the next time the token needs to be refreshed
                        this.refreshTokenInProgress = false;
                        this.refreshTokenSubject.next(token);
                        return next.handle(this.addAuthenticationToken(request));
                    })
                    .catch((err: any) => {
                        this.refreshTokenInProgress = false;
                        this.userStateFacade.logout();
                        return throwError(err);
                    });
            }
        });
    }

    private addAuthenticationToken(request: HttpRequest<any>) {
        let token = this.store.selectSnapshot(UserState.accessToken);
        const refreshToken = this.store.selectSnapshot(UserState.refreshToken);

        const path = request.url;
        if (path.includes("/authenticate/refresh")) {
            token = refreshToken;
        }

        if (!token) {
            return request;
        }

        return request.clone({
            setHeaders: {
                Authorization: token
            }
        });
    }
}
