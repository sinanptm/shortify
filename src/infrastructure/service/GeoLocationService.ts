import axios from 'axios';
import IGeolocationService, { GeoLocationResponse } from '@/domain/interface/services/IGeolocationService';
import logger from '@/utils/logger';

export default class GeolocationService implements IGeolocationService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://ip-api.com/json/';
    }

    async locate(ipAddress: string): Promise<GeoLocationResponse | null> {
        try {
            const response = await axios.get(`${this.apiUrl}${ipAddress}`);
            const { country, regionName, city } = response.data;
            console.log(response.data);

            return {
                ip: ipAddress,
                country: country || '',
                region: regionName || '',
                city: city || '',
            };
        } catch (error) {
            logger.error('Error fetching geolocation data:', error);
            return null; 
        }
    }
}
