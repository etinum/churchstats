declare module server {
	interface MeetingViewModel {
		id: number;
		name: string;
		meetingTypeId: number;
		dayOfTheWeek: number;
		leadUserId: number;
		addressId: number;
		contactInfoId: number;
		notes: string;
		usualTime: Date;
		dateCreated: Date;
		lastUpdated: Date;
		lastEditedBy: number;
	}
}
