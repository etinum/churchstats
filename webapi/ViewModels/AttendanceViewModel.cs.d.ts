declare module server {
	interface AttendanceViewModel {
		id: number;
		userId: number;
		meetingId: number;
		recorderId: number;
		dateRecorded: Date;
		lastUpdated: Date;
		meetingDate: Date;
		attendTypeId: number;
		isVisitor: boolean;
		notes: string;
		isArchive: boolean;
	}
}
