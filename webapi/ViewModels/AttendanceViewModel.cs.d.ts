declare module server {
	interface AttendanceViewModel {
		id: number;
		userId: number;
		meetingId: number;
		recorderId: number;
		isAttend: boolean;
		meetingDate: Date;
		lastUpdated: Date;
		notes: string;
	}
}
