declare module modeltypings {
    interface UserViewModel {
        id: number;
        firstName: string;
        lastName: string;
        gender: boolean;
        birthYear: number;
        picture: any[];
        isSaved: boolean;
        isBaptized: boolean;
        middleName: string;
        notes: string;
        baptizedDate: Date;
        savedDate: Date;
        addressId: number;
        contactInfoId: number;
        localityId: number;
        dateCreated: Date;
        lastUpdated: Date;
        lastEditedBy: number;
        fullName: string;
        fullNameRev: string;
        attendType: AttendTypeEnum;
        recorderId: number;
        recorderName: string;
        attendanceId: number;
        lastRecorded: Date;
        attendanceNotes: string;

    }

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

    interface MeetingTypeViewModel {
        id: number;
        name: string;
        active: boolean;
    }

    interface XMeetingMemberModel {
        memberId: number;
        meetingId: number;
    }
    interface XMeetingUserViewModel {
        userId: number;
        meetingId: number;
        memberType: MemberTypeEnum;
        effectiveDateAdded: Date;
    }

    interface AttendanceViewModel {
        id: number;
        userId: number;
        meetingId: number;
        recorderId: number;
        dateRecorded: Date;
        lastUpdated: Date;
        meetingDate: Date;
		attendType: AttendTypeEnum;
        memberType: MemberTypeEnum;
        isVisitor: boolean;
        notes: string;
        isArchive: boolean;

    }

    const enum AttendTypeEnum {
        Present = 1,
        Absent = 2,
        Unknown = 3,
        Late = 4,
    }
    const enum MemberTypeEnum {
        Visitor = 1,
        Returning = 2,
    }
}
