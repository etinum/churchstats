declare module modeltypings {
    interface UserViewModel {
        id: number;
        firstName: string;
        middleName: string;
        lastName: string;
        gender: boolean;
        birthYear: number;
        picture: any[];
        isSaved: boolean;
        isBaptized: boolean;
        isActive: boolean;
        userType: UserTypeEnum;
        notes: string;
        baptizedDate: Date;
        savedDate: Date;
        addressId: number;
        contactInfoId: number;
        localityId: number;
        createdByUserId: number;
        modifiedByUserId: number;
        modifiedDate: Date;
        createdDate: Date;


        fullName: string;
        fullNameRev: string;
        attendType: AttendTypeEnum;
        memberType: MemberTypeEnum;
        recorderId: number;
        recorderName: string;
        attendanceId: number;
        lastRecorded: Date;
        attendanceNotes: string;

        longPressActive: number;

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
    }

    interface MeetingTypeViewModel {
        id: number;
        name: string;
        active: boolean;
    }

    interface XMeetingUserViewModel {
        userId: number;
        meetingId: number;
        memberType: MemberTypeEnum;
        active: boolean;
        effectiveDate: Date;
    }

    interface AttendanceViewModel {
        id: number;
        userId: number;
        meetingId: number;
        recorderId: number;
        dateRecorded: Date;
        meetingDate: Date;
        attendType: any;
        memberType: MemberTypeEnum;
        notes: string;
        isArchive: boolean;
        createdByUserId: number;
        modifiedByUserId: number;
        modifiedDate: Date;
        createdDate: Date;

    }

    const enum AttendTypeEnum {
        Present = 1,
        Absent = 2,
        Unknown = 3,
        Late = 4,
    }
    const enum MemberTypeEnum {
        Normal = 1,
        Returning = 2,
        Visitor = 3,
    }

    const enum UserTypeEnum {
        Normal = 1,
        GospelContact = 2,
    }
}
