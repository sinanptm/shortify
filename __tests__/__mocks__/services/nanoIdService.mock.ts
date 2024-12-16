import INanoIdService from "@/domain/interface/services/INanoIdService";

export const mockNanoIdService:jest.Mocked<INanoIdService> = {
    generateId:jest.fn()
}
