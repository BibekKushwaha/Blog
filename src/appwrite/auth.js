import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        console.log("Creating account for:", email);
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            console.log("User account created:", userAccount);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async login({email, password}) {
        
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log("User logged in:", session);
            return session;

        } catch (error) {
            console.error(error);
            throw error;
            
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService
