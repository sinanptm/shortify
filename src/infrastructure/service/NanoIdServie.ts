const { nanoid } = require("nanoid");
import INanoIdService from "@/domain/interface/services/INanoIdService";

export default class NanoIdService implements INanoIdService {
    private defaultLength: number;
    constructor(defaultLength = 10) { 
        this.defaultLength = defaultLength;
    }

    generateId(length?: number): string {
        return nanoid(length || this.defaultLength);
    }
}