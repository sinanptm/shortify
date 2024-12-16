import INanoIdService from "@/domain/interface/services/INanoIdService";

export default class NanoIdService implements INanoIdService {
    private nanoid!: (length: number) => string;

    constructor() {
        this.loadNanoId();
    }

    private async loadNanoId() {
        try {
            const { nanoid } = await import('nanoid');
            this.nanoid = nanoid; 
        } catch (error) {
            console.error('Error loading nanoid:', error);
            this.nanoid = () => ''; 
        }
    }

    generateId(length: number): string {
        if (!this.nanoid) {
            throw new Error('Nanoid service not initialized');
        }
        return this.nanoid(length);
    }
}
