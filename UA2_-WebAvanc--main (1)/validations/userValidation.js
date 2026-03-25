import { body, param } from "express-validator";

const nameRegex =/^[a-zA-Z]{2,}$/

const conduiteValidator = body('conduite')
    .optional()
    .customSanitizer((value) => typeof value === 'string' ? value.toLowerCase() : value)
    .isIn(["excellente", "bonne", "passable"]).withMessage("la conduite doit etre excellente, bonne ou passable")

const baseUserRules = [
    body('nom').optional().matches(nameRegex).withMessage("le nom n'est pas conforme"),
    body('prenom').optional().matches(nameRegex).withMessage("le prenom n'est pas conforme"),
    body('email').optional().isEmail().withMessage("ceci n'est pas un email"),
    body('naissance').optional({ values: 'falsy' }).isDate().withMessage("la date de naissance doit etre une date valide").custom((value) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 0) {
            throw new Error("la date de naissance ne peut pas etre dans le futur");
        }
        return true;
    }),
    body('biographie').optional().isLength({ min: 20 }).withMessage("la biographie doit contenir au moins 20 caracteres"),
    conduiteValidator,
    body('photo').optional().isURL().withMessage("la photo doit etre une url"),
    body('DepartmentId').optional().isInt({ min: 1 }).withMessage("l'id doit etre un entier positif"),
    param('id').optional().isInt({ min: 1 }).withMessage("l'id doit etre un entier positif")
]

export const createUserRules = [
    body('nom').exists({ checkFalsy: true }).withMessage('nom obligatoire').matches(nameRegex).withMessage("le nom n'est pas conforme"),
    body('prenom').exists({ checkFalsy: true }).withMessage('prenom obligatoire').matches(nameRegex).withMessage("le prenom n'est pas conforme"),
    body('email').exists({ checkFalsy: true }).withMessage('email obligatoire').isEmail().withMessage("ceci n'est pas un email"),
    body('mot_de_passe').isString()
        .isLength({ min: 8 }).withMessage('au moins 8 caracteres')
        .matches(/\d/).withMessage('au moins un chiffre')
        .matches(/[a-z]/).withMessage('au moins une lettre minuscule')
        .matches(/[A-Z]/).withMessage('au moins une lettre majuscule')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('au moins un caractere special'),
    ...baseUserRules
]

export const updateUserRules = [
    ...baseUserRules,
    body('mot_de_passe').optional({ values: 'falsy' }).isString()
        .isLength({ min: 8 }).withMessage('au moins 8 caracteres')
        .matches(/\d/).withMessage('au moins un chiffre')
        .matches(/[a-z]/).withMessage('au moins une lettre minuscule')
        .matches(/[A-Z]/).withMessage('au moins une lettre majuscule')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('au moins un caractere special')
]

export default createUserRules
