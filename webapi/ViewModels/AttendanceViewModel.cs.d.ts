declare module server {
	interface AttendanceViewModel {
		id: number;
		userId: number;
		meetingId: number;
		recorderId: number;
		dateRecorded: Date;
		meetingDate: Date;
		attendType: any;
		memberType: any;
		notes: string;
		isArchive: boolean;
		createdByUserId: number;
		modifiedByUserId: number;
		modifiedDate: Date;
		createdDate: Date;
	}
}
