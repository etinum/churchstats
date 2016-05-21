declare module modeltypings {
    interface RepoFormViewModel {
        createdDate: Date;
        repoDate: Date;
        accountNumber: string;
        investigator: string;
        client: string;
        closeType: string;
        customerName: string;
        points: string;
        recoveryAgent: string;
        notes: string;
        recoveryAddress: string;
        recoveryCity: string;
        recoveryState: string;
        recoveryZip: string;
        storageAddress: string;
        storageCity: string;
        storageState: string;
        storageZip: string;
        storageAdditionalFees: string;
        storageFeeReason: string;
        policeDept: string;
        policeNumber: string;
        policeBadgeNumber: string;
        keysChecked: boolean;
        drivableChecked: boolean;
        personals: string;
        iPRUpdated: string;
        repoProcessing: string;
        billing: string;
        initializedDate: Date;
        originalUserId: number;
    }

    interface RepoFormTypeAheadModel {
        investigator: string;
        clientList: string[];
        customerList: string[];
        recoveryAgentList: string[];
    }


}
