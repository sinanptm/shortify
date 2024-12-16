import { ValidationError } from "@/domain/entities/CustomErrors";
import IValidatorService from "@/domain/interface/services/IValidatorService";
import * as yup from 'yup';

export default class ValidatorService implements IValidatorService {
    private emailSchema = yup.string().email('Invalid email format').required('Email is required');
    private urlSchema = yup.string().url('Invalid URL format').required('URL is required');
    private stringSchema = yup.string().trim().min(1, 'String cannot be empty').required('String is required');

    private catcher(func: () => void): boolean {
        try {
            func();
            return true;
        } catch (error: any) {
            throw new ValidationError(error.message);
        }
    }

    validateEmail(email: string): boolean {
        return this.catcher(() => this.emailSchema.validateSync(email));
    }

    validateUrl(url: string): boolean {
        return this.catcher(() => this.urlSchema.validateSync(url));
    }

    validateString(str: string): boolean {
        return this.catcher(() => this.stringSchema.validateSync(str));
    }
}
