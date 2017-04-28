/// <reference path="./cstatsviewmodels.cs.d.ts" />
declare module scopeTypings {
    interface IReportScope {
        grids: modeltypings.ReportGrid[];

        // Functions
        Refresh(grid: modeltypings.ReportGrid): void; 

    }
}