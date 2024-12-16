import INanoIdService from "@/domain/interface/services/INanoIdService";

const mockNanoIdService:jest.Mocked<INanoIdService> = {
    generateId:jest.fn()
}

export default mockNanoIdService