import { ValidationError } from "@/domain/entities/CustomErrors";
import IValidatorService from "@/domain/interface/services/IValidatorService";
import { isEmail, isURL } from 'validator';

export default class ValidatorService implements IValidatorService {
    validateEmail(email: string): boolean {
        if (!isEmail(email)) {
            throw new ValidationError('Invalid email format');
        }
        return true;
    }

    validateUrl(url: string): boolean {
        if (!isURL(url)) {
            throw new ValidationError('Invalid URL format');
        }
        return true;
    }
}
