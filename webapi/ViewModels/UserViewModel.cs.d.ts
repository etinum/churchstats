declare module server {
	interface UserViewModel {
		id: number;
		firstName: string;
		lastName: string;
		gender: boolean;
		birthYear: number;
		picture: any[];
		isSaved: boolean;
		isBaptized: boolean;
		middleName: string;
		notes: string;
		baptizedDate: Date;
		savedDate: Date;
		addressId: number;
		contactInfoId: number;
		localityId: number;
		dateCreated: Date;
		lastUpdated: Date;
		lastEditedBy: number;
		attendType: any;
		recorderId: number;
		recorderName: string;
		attendanceId: number;
		lastRecorded: Date;
		attendanceNotes: string;
	}
}
