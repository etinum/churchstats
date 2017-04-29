/// <reference path="./cstatsviewmodels.cs.d.ts" />
declare module scopeTypings {
    interface IReportScope {
        meetingList: modeltypings.MeetingViewModel[];
        grids: modeltypings.ReportGrid[];

        // Functions
        Refresh(grid: modeltypings.ReportGrid): void; 
        ChangeAttendanceDateToday(index: number): void;
        AddGrid(insertIndex: number);
    }
}