declare module server {
	interface MeetingViewModel {
		id: number;
		name: string;
		meetingTypeId: number;
		dayOfTheWeek: number;
		description: string;
		usualTime: Date;
		dateCreated: Date;
		lastUpdated: Date;
	}
}
