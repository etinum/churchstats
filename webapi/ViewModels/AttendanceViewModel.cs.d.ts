declare module server {
	interface AttendanceViewModel {
		id: number;
		userId: number;
		meetingId: number;
		recorderId: number;
		dateRecorded: Date;
		lastUpdated: Date;
		meetingDate: Date;
		attendType: any;
		memberType: any;
		notes: string;
		isArchive: boolean;
	}
}
