// Complex Multi-Module TypeScript Application Demo
// Author: Piyush Seth

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

class EnterpriseUserService {
  private users: UserProfile[] = [];

  public registerUser(user: UserProfile): void {
    // Intentional Error 1: Property does not exist on type
    console.log("Registering user:", user.phoneNumber);
    this.users.push(user);
  }

  public findUserByName(name: string): UserProfile | undefined {
    // Intentional Error 2: Cannot find name (missing import / variable)
    const result = userDatabase.find((u) => u.name === name);
    return result;
  }
}

class TransactionEngine {
  public executePayment(user: UserProfile, amount: number): void {
    // Intentional Error 3: Cannot read property of undefined
    const account: any = undefined;
    console.log("Account Balance:", account.balance);
  }
}

const service = new EnterpriseUserService();
service.registerUser({ id: 1, name: "Piyush", email: "piyush@example.com" });
