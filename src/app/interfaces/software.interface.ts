export interface ISoftware {
    id: number;
    name: string;
    employeeId: number;
    employeeName: string;
    details: {
        description: string;
    }
}