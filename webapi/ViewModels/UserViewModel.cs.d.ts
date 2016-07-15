declare module server {
	interface UserViewModel {
		id: number;
		firstName: string;
		middleName: string;
		lastName: string;
		gender: boolean;
		birthYear: number;
		picture: any[];
		isSaved: boolean;
		isBaptized: boolean;
		notes: string;
		baptizedDate: Date;
		savedDate: Date;
		addressId: number;
		contactInfoId: number;
		localityId: number;
		createdByUserId: number;
		modifiedByUserId: number;
		modifiedDate: Date;
		createdDate: Date;
		attendType: any;
		recorderId: number;
		recorderName: string;
		attendanceId: number;
		lastRecorded: Date;
		attendanceNotes: string;
	}
}
