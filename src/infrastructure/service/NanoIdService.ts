const { nanoid } = require("nanoid");
import INanoIdService from "@/domain/interface/services/INanoIdService";

export default class NanoIdService implements INanoIdService {
    generateId(length: number): string {
        return nanoid(length);
    }
}