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
		email: string;
		phoneNumber: string;
		baptizedDate: Date;
		savedDate: Date;
		locality: string;
		isAttend: boolean;
		recorderId: number;
		recorderName: string;
		attendanceId: number;
	}
}
