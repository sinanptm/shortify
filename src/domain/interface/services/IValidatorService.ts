export default interface IValidatorService {
    validateEmail(email: string): boolean;
    validateUrl(url: string): boolean;
    validateLength(val: string, length: number, field: string): boolean;
    validateString(str:string,field:string):boolean;
    validateRequiredFields(values: object): void;
}