import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Role, Subject, User } from "../models/relation.js";

// 1 - Liste des utilisateurs
export const userList = async (req, res) => {
    const { page, size, search } = req.query;
    const { limit, offset } = paginate(page, size);
    const condition = search
        ? { nom: { [Op.like]: `%${search}%` } }
        : undefined;

    try {
        const { rows: users, count: total } = await User.findAndCountAll({
            attributes: { exclude: ["mot_de_passe"] },
            limit,
            offset,
            where: condition
        });

        const currentPage = page ? +page : 1;
        const totalPages = total ? Math.ceil(total / limit) : 1;

        res.status(200).json({
            data: {
                users,
                total,
                currentPage,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 2 - Ajouter un nouvel utilisateur
export const addUser = async (req, res) => {
    const picture = req.file;
    const imagePath = picture?.path?.split("\\").join("/");
    const fullPath = picture
        ? req.protocol + "://" + req.get("host") + "/" + imagePath
        : null;

    const { mot_de_passe, ...restOfNewUser } = req.body;

    try {
        if (!mot_de_passe) {
            return res.status(400).json({
                message: "Le mot de passe est obligatoire"
            });
        }

        const existingUser = await User.findOne({
            where: { email: restOfNewUser.email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Cet email existe deja"
            });
        }

        const motDePasseCrypte = bcrypt.hashSync(mot_de_passe, 10);

        const result = await User.create({
            mot_de_passe: motDePasseCrypte,
            photo: fullPath,
            ...restOfNewUser
        });

        const createdUser = await User.findByPk(result.id, {
            attributes: { exclude: ["mot_de_passe"] }
        });

        res.status(201).json({
            message: "Utilisateur cree avec succes",
            data: createdUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 3 - Mise a jour d'un utilisateur
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const infoUser = req.body;
    const { photo, mot_de_passe, ...infoSansPhotoEtMotDePasse } = infoUser;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        if (infoSansPhotoEtMotDePasse.email) {
            const existingUser = await User.findOne({
                where: {
                    email: infoSansPhotoEtMotDePasse.email
                }
            });

            if (existingUser && existingUser.id !== Number(id)) {
                return res.status(400).json({
                    message: "Cet email existe deja"
                });
            }
        }

        await User.update(infoSansPhotoEtMotDePasse, { where: { id } });

        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ["mot_de_passe"] }
        });

        res.status(200).json({
            message: `User no ${id} updated`,
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 4 - Mise a jour de la photo
export const updateUserPhoto = async (req, res) => {
    const { id } = req.params;
    const image = req.file;
    const imagePath = image?.path?.split("\\").join("/");
    const fullPath = image
        ? req.protocol + "://" + req.get("host") + "/" + imagePath
        : null;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        if (!fullPath) {
            return res.status(400).json({
                message: "Aucune photo envoyee"
            });
        }

        await User.update({ photo: fullPath }, { where: { id } });

        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ["mot_de_passe"] }
        });

        res.status(200).json({
            message: "Photo de l'utilisateur mise a jour",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 5 - Suppression d'un utilisateur
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        await User.destroy({ where: { id } });

        res.status(200).json({
            message: `User no ${id} removed`
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 6 - Profil d'un utilisateur
export const userById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ["mot_de_passe"] },
            include: [
                "Department",
                {
                    model: Role,
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Subject,
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        res.status(200).json({
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 7 - Departement d'un utilisateur
export const userDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        const department = await user.getDepartment();

        res.status(200).json({
            data: department
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 8 - Matieres d'un utilisateur
export const userSubjects = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${id} introuvable`
            });
        }

        const subjects = await user.getSubjects();

        res.status(200).json({
            data: subjects
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 9 - Ajouter des roles a un utilisateur
export const addUserToRoles = async (req, res) => {
    const { ids } = req.body;
    const { id: userId } = req.params;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${userId} introuvable`
            });
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Le champ ids doit etre un tableau non vide"
            });
        }

        const roles = await Role.findAll({ where: { id: ids } });

        await user.setRoles(roles);

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ["mot_de_passe"] },
            include: [
                {
                    model: Role,
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        res.status(201).json({
            message: "roles ajoutes avec succes",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 10 - Ajouter des matieres a un utilisateur
export const addUserToSubjects = async (req, res) => {
    const { ids } = req.body;
    const { id: userId } = req.params;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: `Utilisateur ${userId} introuvable`
            });
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Le champ ids doit etre un tableau non vide"
            });
        }

        const subjects = await Subject.findAll({ where: { id: ids } });

        await user.setSubjects(subjects);

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ["mot_de_passe"] },
            include: [
                {
                    model: Subject,
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        res.status(201).json({
            message: "matieres ajoutees avec succes",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};