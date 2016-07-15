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
		createdByUserId: number;
		modifiedByUserId: number;
		modifiedDate: Date;
		createdDate: Date;
	}
}
