import { Injectable } from "@angular/core";

@Injectable()
export class UtilsProvider {

    convertUserPowerToRoleName(userPower: number | string): string {
        if (userPower === 1 || userPower === "1") {
            return "Admin"
        } else if (userPower === 10 || userPower === "10") {
            return "Organisation Admin";
        } else if (userPower === 100 || userPower === "100") {
            return "User";
        }
    }

    convertRoleNameToUserPower(userRole: string): number {
        switch (userRole) {
            case "User": 
                return 100;
            case "Admin": 
                return 1;
        }
    }
}
