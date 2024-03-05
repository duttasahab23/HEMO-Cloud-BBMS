const userModel = require("../models/userModel");

// Get Donar List
const getDonarListController = async (req, res) => {
    try {
        const donarData = await userModel.find({ role: 'donar' }).sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: donarData.length,
            message: 'Donar List Fetched Successfully',
            donarData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In Donar List API',
            error,
        })
    }
};

// Get Hospital List
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel.find({ role: 'hospital' }).sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: hospitalData.length,
            message: 'Hospital List Fetched Successfully',
            hospitalData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In Hospital List API',
            error,
        })
    }
};

// Get ORG List
const getOrgListController = async (req, res) => {
    try {
        const orgData = await userModel.find({ role: 'organization' }).sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Totalcount: orgData.length,
            message: 'Org List Fetched Successfully',
            orgData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In Org List API',
            error,
        })
    }
};

//=========================================

//Delete Donar
const deleteDonarController = async (req, res) => {

    const { id } = req.params;
    if (!id) return res.status(400).send("Id not provided");
    try {
        await userModel.findByIdAndDelete(req.params.id).then(deleted => {
            if (deleted)
                return res.status(200).send({
                    success: true,
                    message: 'Record Deleted Successfully',

                })
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error while deleting donar',
            error,
        })
    }
};



// Export
module.exports = { getDonarListController, getHospitalListController, getOrgListController, deleteDonarController, };