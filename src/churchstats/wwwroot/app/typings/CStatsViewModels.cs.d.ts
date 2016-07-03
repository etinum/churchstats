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
        email: string;
        phoneNumber: string;
        baptizedDate: Date;
        savedDate: Date;
        locality: string;
        isAttend: boolean;
        recorderId: number;
        recorderName: string;
        attendanceId: number;
        lastRecorded: Date;
        attendanceNotes: string;
        fullName: string;

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
    }

    interface AttendanceViewModel {
        id: number;
        userId: number;
        meetingId: number;
        recorderId: number;
        dateRecorded: Date;
        lastUpdated: Date;
        meetingDate: Date;
        attendTypeId: number;
        isVisitor: boolean;
        notes: string;
        isArchive: boolean;

    }

    interface AttendTypeViewModel {
        id: number;
        name: string;
        active: boolean;
    }
}
