﻿declare module server {
	interface XMeetingUserViewModel {
		userId: number;
		meetingId: number;
		memberType: any;
		effectiveDate: Date;
	}
}