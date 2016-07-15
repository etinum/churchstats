declare module server {
	interface MeetingTypeViewModel {
		id: number;
		name: string;
		active: boolean;
		createdByUserId: number;
		modifiedByUserId: number;
		modifiedDate: Date;
		createdDate: Date;
	}
}
