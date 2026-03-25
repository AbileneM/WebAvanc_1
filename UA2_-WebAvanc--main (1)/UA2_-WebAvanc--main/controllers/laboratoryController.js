import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Laboratory } from "../models/relation.js";

// 1 - Liste des labs
export const laboratoryList = async (req, res) => {
    const { page, size, search } = req.query;
    const { limit, offset } = paginate(page, size);
    const condition = search
        ? { nom: { [Op.like]: `%${search}%` } }
        : undefined;

    try {
        const { rows: laboratories, count: total } = await Laboratory.findAndCountAll({
            limit,
            offset,
            where: condition
        });

        const currentPage = page ? +page : 1;
        const totalPages = total ? Math.ceil(total / limit) : 1;

        res.status(200).json({
            data: {
                laboratories,
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

// 2 - Ajouter un lab
export const addLaboratory = async (req, res) => {
    const infoLab = req.body;
    const picture = req.file;

    const imagePath = picture?.path?.split("\\").join("/");
    const fullPath = picture
        ? req.protocol + "://" + req.get("host") + "/" + imagePath
        : null;

    const newLab = { ...infoLab, image: fullPath };

    try {
        const result = await Laboratory.create(newLab);

        res.status(201).json({
            message: "Lab cree",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 3 - Editer un lab
export const updateLaboratory = async (req, res) => {
    const { id } = req.params;
    const infoLab = req.body;
    const { image, ...infoSansImage } = infoLab;

    try {
        const lab = await Laboratory.findByPk(id);

        if (!lab) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        await Laboratory.update(infoSansImage, { where: { id } });

        const updatedLab = await Laboratory.findByPk(id);

        res.status(200).json({
            message: "Lab mis a jour",
            data: updatedLab
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 4 - Mise a jour de l'image du lab
export const updateLaboratoryImage = async (req, res) => {
    const { id } = req.params;
    const image = req.file;

    const imagePath = image?.path?.split("\\").join("/");
    const fullPath = image
        ? req.protocol + "://" + req.get("host") + "/" + imagePath
        : null;

    try {
        const lab = await Laboratory.findByPk(id);

        if (!lab) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        if (!fullPath) {
            return res.status(400).json({
                message: "Aucune image envoyee"
            });
        }

        await Laboratory.update({ image: fullPath }, { where: { id } });

        const updatedLab = await Laboratory.findByPk(id);

        res.status(200).json({
            message: "Image du lab mise a jour",
            data: updatedLab
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 5 - Supprimer un lab
export const deleteLaboratory = async (req, res) => {
    const { id } = req.params;

    try {
        const lab = await Laboratory.findByPk(id);

        if (!lab) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        await Laboratory.destroy({ where: { id } });

        res.status(200).json({
            message: `Laboratoire ${id} supprime`
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 6 - Details d'un lab
export const detailsLaboratory = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Laboratory.findByPk(id, {
            include: "Department"
        });

        if (!result) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        res.status(200).json({
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 7 - Matieres d'un lab
export const laboratorySubjects = async (req, res) => {
    const { id } = req.params;

    try {
        const lab = await Laboratory.findByPk(id);

        if (!lab) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        const subjects = await lab.getSubjects();

        res.status(200).json({
            data: subjects
        });
    } catch (error) {
        res.status(400).json({
            message: `Les matieres du lab no ${id} n'existent pas`
        });
    }
};

// 8 - Equipements d'un lab
export const laboratoryEquipments = async (req, res) => {
    const { id } = req.params;

    try {
        const lab = await Laboratory.findByPk(id);

        if (!lab) {
            return res.status(404).json({
                message: `Laboratoire ${id} introuvable`
            });
        }

        const equipments = await lab.getEquipment();

        res.status(200).json({
            data: equipments
        });
    } catch (error) {
        res.status(400).json({
            message: `Les equipements du lab no ${id} n'existent pas`
        });
    }
};