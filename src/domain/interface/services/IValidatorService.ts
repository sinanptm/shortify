export default interface IValidatorService {
    validateEmail(email:string):boolean;
    validateUrl(url:string):boolean;
}