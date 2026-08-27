interface UserProfile {
    id: number;
    name: string;
    email: string;
}
declare class EnterpriseUserService {
    private users;
    registerUser(user: UserProfile): void;
    findUserByName(name: string): UserProfile | undefined;
}
declare class TransactionEngine {
    executePayment(user: UserProfile, amount: number): void;
}
declare const service: EnterpriseUserService;
//# sourceMappingURL=complex_demo.d.ts.map