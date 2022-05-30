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
import { Role } from './role';
import { User } from './user';
import { Channel } from './channel';


export interface ChannelUser { 
    channel?: Channel;
    user?: User;
    is_ban?: boolean;
    role?: Role;
    created_at?: string;
    updated_at?: string;
}

