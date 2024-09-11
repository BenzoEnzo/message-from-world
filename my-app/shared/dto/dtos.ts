/* tslint:disable */
/* eslint-disable */

export namespace DTOs {

    export interface AuthorizationDTO {
        jwtToken: string;
        profile: UserDTO;
    }

    export interface DataCenterInfo {
        "@class": string;
        name: Name;
    }

    export interface InstanceInfo {
        actionType: ActionType;
        app: string;
        appGroupName: string;
        asgName: string;
        /**
         * @deprecated
         */
        countryId: number;
        dataCenterInfo: DataCenterInfo;
        healthCheckUrl: string;
        homePageUrl: string;
        hostName: string;
        instanceId: string;
        ipAddr: string;
        isCoordinatingDiscoveryServer: boolean;
        /**
         * @deprecated
         */
        isDirty: boolean;
        lastDirtyTimestamp: number;
        lastUpdatedTimestamp: number;
        leaseInfo: LeaseInfo;
        metadata: { [index: string]: string };
        overriddenStatus: InstanceStatus;
        overriddenstatus: InstanceStatus;
        port: PortWrapper;
        secureHealthCheckUrl: string;
        securePort: PortWrapper;
        secureVipAddress: string;
        /**
         * @deprecated
         */
        sid: string;
        status: InstanceStatus;
        statusPageUrl: string;
        statusWithoutDirty: InstanceStatus;
        vipAddress: string;
    }

    export interface LeaseInfo {
        durationInSecs: number;
        evictionTimestamp: number;
        lastRenewalTimestamp: number;
        registrationTimestamp: number;
        renewalIntervalInSecs: number;
        renewalTimestamp: number;
        serviceUpTimestamp: number;
    }

    export interface MessageDTO {
        content: string;
        messageId: string;
        metadata: MetadataDTO;
        profile: UserDTO;
        read: boolean;
        reader: ReaderDTO;
        sendAt: DateAsString;
    }

    export interface MetadataDTO {
        deviceName: string;
        ipAddress: string;
    }

    export interface PortWrapper {
        $: number;
        "@enabled": boolean;
        enabled: boolean;
        port: number;
    }

    export interface ReaderDTO {
        id: string;
        readTimestamp: DateAsString;
        userName: string;
    }

    export interface ReplicationInstance {
        action: Action;
        appName: string;
        id: string;
        instanceInfo: InstanceInfo;
        lastDirtyTimestamp: number;
        overriddenStatus: string;
        status: string;
    }

    export interface ReplicationList {
        replicationList: ReplicationInstance[];
    }

    export interface SignInDTO {
        mail: string;
        password: string;
    }

    export interface StatusInfo {
        applicationStats: { [index: string]: string };
        generalStats: { [index: string]: string };
        healthy: boolean;
        instanceInfo: InstanceInfo;
    }

    export interface UserDTO {
        clientAppId: string;
        country: string;
        createdAt?: DateAsString;
        deprecate?: boolean;
        id?: number;
        lastLoggedAt?: DateAsString;
        mail: string;
        password: string;
        points?: number;
        role: Role;
        username: string;
    }

    export type DateAsString = string;

    export enum Action {
        Heartbeat = "Heartbeat",
        Register = "Register",
        Cancel = "Cancel",
        StatusUpdate = "StatusUpdate",
        DeleteStatusOverride = "DeleteStatusOverride",
    }

    export enum ActionType {
        ADDED = "ADDED",
        MODIFIED = "MODIFIED",
        DELETED = "DELETED",
    }

    export enum InstanceStatus {
        UP = "UP",
        DOWN = "DOWN",
        STARTING = "STARTING",
        OUT_OF_SERVICE = "OUT_OF_SERVICE",
        UNKNOWN = "UNKNOWN",
    }

    export enum Name {
        Netflix = "Netflix",
        Amazon = "Amazon",
        MyOwn = "MyOwn",
    }

    export enum Role {
        USER = "USER",
        ADMINISTRATOR = "ADMINISTRATOR",
    }

}
