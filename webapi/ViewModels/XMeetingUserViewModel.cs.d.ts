declare module server {
	interface XMeetingUserViewModel {
		userId: number;
		meetingId: number;
		memberType: any;
		active: boolean;
		effectiveDate: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modifiedDate: Date;
		createdDate: Date;
	}
}
