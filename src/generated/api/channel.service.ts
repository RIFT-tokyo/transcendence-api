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
import { Channel } from '../model/channel';
import { ChannelPassword } from '../model/channelPassword';
import { NewChannel } from '../model/newChannel';
import { Configuration } from '../configuration';


@Injectable()
export class ChannelService {

    protected basePath = 'http://localhost:4211/api';
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
     * Leave channel
     * 
     * @param channelID 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteMeChannelsChannelId(channelID: number, ): Observable<AxiosResponse<any>>;
    public deleteMeChannelsChannelId(channelID: number, ): Observable<any> {

        if (channelID === null || channelID === undefined) {
            throw new Error('Required parameter channelID was null or undefined when calling deleteMeChannelsChannelId.');
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
        return this.httpClient.delete<any>(`${this.basePath}/me/channels/${encodeURIComponent(String(channelID))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * List channels
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getChannels(): Observable<AxiosResponse<Array<Channel>>>;
    public getChannels(): Observable<any> {

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
        return this.httpClient.get<Array<Channel>>(`${this.basePath}/channels`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * List channels in which the authenticated user participates
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getChannelsMe(): Observable<AxiosResponse<Array<Channel>>>;
    public getChannelsMe(): Observable<any> {

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
        return this.httpClient.get<Array<Channel>>(`${this.basePath}/me/channels`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Create new channel
     * 
     * @param newChannel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postChannels(newChannel?: NewChannel, ): Observable<AxiosResponse<Channel>>;
    public postChannels(newChannel?: NewChannel, ): Observable<any> {


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
        return this.httpClient.post<Channel>(`${this.basePath}/channels`,
            newChannel,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Update a channel
     * 
     * @param channelID 
     * @param newChannel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putChannelsChannelID(channelID: number, newChannel?: NewChannel, ): Observable<AxiosResponse<any>>;
    public putChannelsChannelID(channelID: number, newChannel?: NewChannel, ): Observable<any> {

        if (channelID === null || channelID === undefined) {
            throw new Error('Required parameter channelID was null or undefined when calling putChannelsChannelID.');
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
        return this.httpClient.put<any>(`${this.basePath}/channels/${encodeURIComponent(String(channelID))}`,
            newChannel,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
    /**
     * Join channel
     * 
     * @param channelID 
     * @param channelPassword 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putMeChannelsChannelId(channelID: number, channelPassword?: ChannelPassword, ): Observable<AxiosResponse<Channel>>;
    public putMeChannelsChannelId(channelID: number, channelPassword?: ChannelPassword, ): Observable<any> {

        if (channelID === null || channelID === undefined) {
            throw new Error('Required parameter channelID was null or undefined when calling putMeChannelsChannelId.');
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
        return this.httpClient.put<Channel>(`${this.basePath}/me/channels/${encodeURIComponent(String(channelID))}`,
            channelPassword,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers
            }
        );
    }
}
