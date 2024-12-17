import IGeoLocalService, { GeoLocationResponse } from "@/domain/interface/services/IGeolocationService";

const mockGeoLocalService: jest.Mocked<IGeoLocalService> = {
    locate: jest.fn().mockResolvedValue({
        ip: "192.168.1.1",
        country: "USA",
        region: "California",
        city: "Los Angeles",
    } as GeoLocationResponse), 
};

export default mockGeoLocalService;
