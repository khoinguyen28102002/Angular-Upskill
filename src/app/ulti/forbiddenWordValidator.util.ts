import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenWordValidator(word: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (typeof value === 'string' && value.toLowerCase().includes(word.toLowerCase())) {
            return { forbiddenWord: { word } };
        }
        return null;
    }
}