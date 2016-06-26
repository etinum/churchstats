declare module server {
	interface AttendanceModel {
		id: number;
		userId: number;
		meetingId: number;
		recorderId: number;
		isAttend: boolean;
	}
}
