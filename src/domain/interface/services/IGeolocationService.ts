export interface GeoLocationResponse {
    ip: string;
    country?: string;
    region?: string;
    city?: string;
}
export default interface IGeoLocalService {
    locate(ipAddress: string): Promise<GeoLocationResponse | null>;
}