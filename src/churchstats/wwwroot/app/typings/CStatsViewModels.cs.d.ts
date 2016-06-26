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
        fullName: string;
        isAttend: boolean;

    }

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

    interface MeetingTypeViewModel {
        id: number;
        name: string;
        active: boolean;
    }

    interface XMeetingMemberModel {
        memberId: number;
        meetingId: number;
    }
}
