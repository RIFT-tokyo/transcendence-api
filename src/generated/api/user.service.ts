/**
 * transcendence API
 * The transendence API enables programmatic access to transcendence.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RequestUser } from '../model/requestUser';
import { ResponseUser } from '../model/responseUser';
import { Configuration } from '../configuration';


@Injectable()
export class UserService {

    protected basePath = 'http://localhost:4211';
    public defaultHeaders: Record<string,string> = {};
    public configuration = new Configuration();

    constructor(protected httpClient: HttpService, @Optional() configuration: Configuration) {
        this.configuration = configuration || this.configuration;
        this.basePath = configuration?.basePath || this.basePath;
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        return consumes.includes(form);
    }

    /**
     * Delete a user
     * 
     * @param userID 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteUsersUserId(userID: number, ): Observable<AxiosResponse<any>>;
    public deleteUsersUserId(userID: number, ): Observable<any> {

        if (userID === null || userID === undefined) {
            throw new Error('Required parameter userID was null or undefined when calling deleteUsersUserId.');
        }

        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return this.httpClient.delete<any>(`${this.basePath}/users/${encodeURIComponent(String(userID))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Get the authenticated user
     * Retrieve the information of the user with the matching user ID.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMe(): Observable<AxiosResponse<ResponseUser>>;
    public getMe(): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return this.httpClient.get<ResponseUser>(`${this.basePath}/me`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * List users
     * 
     * @param limit 
     * @param offset 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUsers(limit?: number, offset?: number, ): Observable<AxiosResponse<Array<ResponseUser>>>;
    public getUsers(limit?: number, offset?: number, ): Observable<any> {



        let queryParameters = {};
        if (limit !== undefined && limit !== null) {
            queryParameters['limit'] = <any>limit;
        }
        if (offset !== undefined && offset !== null) {
            queryParameters['offset'] = <any>offset;
        }

        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return this.httpClient.get<Array<ResponseUser>>(`${this.basePath}/users`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Get a user
     * Retrieve the information of the user with the matching user ID.
     * @param userID 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUsersUserId(userID: number, ): Observable<AxiosResponse<ResponseUser>>;
    public getUsersUserId(userID: number, ): Observable<any> {

        if (userID === null || userID === undefined) {
            throw new Error('Required parameter userID was null or undefined when calling getUsersUserId.');
        }

        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return this.httpClient.get<ResponseUser>(`${this.basePath}/users/${encodeURIComponent(String(userID))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Get a user by username
     * 
     * @param username Username
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUsersUsername(username: string, ): Observable<AxiosResponse<ResponseUser>>;
    public getUsersUsername(username: string, ): Observable<any> {

        if (username === null || username === undefined) {
            throw new Error('Required parameter username was null or undefined when calling getUsersUsername.');
        }

        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return this.httpClient.get<ResponseUser>(`${this.basePath}/users/by/${encodeURIComponent(String(username))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Create new user
     * 
     * @param requestUser 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postUsers(requestUser?: RequestUser, ): Observable<AxiosResponse<ResponseUser>>;
    public postUsers(requestUser?: RequestUser, ): Observable<any> {


        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers['Content-Type'] = httpContentTypeSelected;
        }
        return this.httpClient.post<ResponseUser>(`${this.basePath}/users`,
            requestUser,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Update a user
     * 
     * @param userID 
     * @param requestUser 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putUsersUserId(userID: number, requestUser?: RequestUser, ): Observable<AxiosResponse<ResponseUser>>;
    public putUsersUserId(userID: number, requestUser?: RequestUser, ): Observable<any> {

        if (userID === null || userID === undefined) {
            throw new Error('Required parameter userID was null or undefined when calling putUsersUserId.');
        }


        let headers = this.defaultHeaders;

        // authentication (sessionAuth) required
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers['Content-Type'] = httpContentTypeSelected;
        }
        return this.httpClient.put<ResponseUser>(`${this.basePath}/users/${encodeURIComponent(String(userID))}`,
            requestUser,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
}
