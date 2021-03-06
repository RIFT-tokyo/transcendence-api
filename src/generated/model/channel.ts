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


export interface Channel { 
    id?: number;
    name?: string;
    is_protected?: boolean;
    role?: Channel.RoleEnum | null;
    created_at?: string;
    updated_at?: string;
}
export namespace Channel {
    export type RoleEnum = 'owner' | 'administrator';
    export const RoleEnum = {
        Owner: 'owner' as RoleEnum,
        Administrator: 'administrator' as RoleEnum
    };
}


