import { ValidationError } from "@/domain/entities/CustomErrors";
import IValidatorService from "@/domain/interface/services/IValidatorService";
import * as yup from 'yup';

export default class ValidatorService implements IValidatorService {
    private emailSchema = yup.string().email('Invalid email format').required('Email is required');
    private urlSchema = yup.string().url('Invalid URL format').required('URL is required');
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
    validateString(str: string, field:string): boolean {
        return this.catcher(() => {
            yup.string().trim().min(1, `${field} cannot be empty`).required(`${field} is required`).validateSync(str);
        });
    }
    validateLength(val: string, length: number, field:string): boolean {
        return this.catcher(() => {
            yup.string().min(length, `${field} must be more than ${length} characters`).validateSync(val);
        });
    }
    validateUrl(url: string): boolean {
        return this.catcher(() => this.urlSchema.validateSync(url));
    }

    validateRequiredFields(values: object): void {
        const schema = yup.object(
            Object.keys(values).reduce((acc, key) => {
                acc[key] = yup.mixed().required(key);
                return acc;
            }, {} as Record<string, yup.AnySchema>)
        );

        try {
            schema.validateSync(values, { abortEarly: false });
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                throw new ValidationError(`${error.errors.join(", ")} is required`);
            }
            throw error;
        }
    }
}
