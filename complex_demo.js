"use strict";
// Complex Multi-Module TypeScript Application Demo
// Author: Piyush Seth
class EnterpriseUserService {
    users = [];
    registerUser(user) {
        // Intentional Error 1: Property does not exist on type
        console.log("Registering user:", user.phoneNumber);
        this.users.push(user);
    }
    findUserByName(name) {
        // Intentional Error 2: Cannot find name (missing import / variable)
        const result = userDatabase.find((u) => u.name === name);
        return result;
    }
}
class TransactionEngine {
    executePayment(user, amount) {
        // Intentional Error 3: Cannot read property of undefined
        const account = undefined;
        console.log("Account Balance:", account.balance);
    }
}
const service = new EnterpriseUserService();
service.registerUser({ id: 1, name: "Piyush", email: "piyush@example.com" });
//# sourceMappingURL=complex_demo.js.map