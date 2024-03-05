const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//CREATE INVENTORY
const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body;
        //validatiion
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User Not Found');
        }
        // if (user.role !== 'admin') {
        //     if (inventoryType === "in" && user.role !== 'donar') {
        //         throw new Error('Not a donar account');
        //     }
        //     if (inventoryType === "out" && user.role !== 'hospital') {
        //         throw new Error('Not a hospital');
        //     }
        // }

        if (req.body.inventoryType == 'out') {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityofBlood = req.body.quantity;
            const organization = new mongoose.Types.ObjectId(req.body.userId);

            // Calculate Blood Quantity
            const totalInofRequestedBlood = await inventoryModel.aggregate(
                [
                    {
                        $match: {
                            organization,
                            inventoryType: 'in',
                            bloodGroup: requestedBloodGroup,
                        },
                    },
                    {
                        $group: {
                            _id: '$bloodGroup',
                            total: { $sum: '$quantity' },
                        },
                    },
                ]);
            //console.log('Total In', totalofRequestedBlood);
            const totalIn = totalInofRequestedBlood[0]?.total || 0;

            //Total OUT Blood Quantity
            const totalOutofRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: 'out',
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' },
                    },
                },
            ]);
            const totalOut = totalOutofRequestedBloodGroup[0]?.total || 0;

            //In and Out Calculation
            const availableQuantityofBloodGroup = totalIn - totalOut;
            // Validation
            if (availableQuantityofBloodGroup < requestedQuantityofBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityofBloodGroup} ml of ${requestedBloodGroup.toUpperCase()} is available`,


                });
            }
            req.body.hospital = user?._id;
        }
        else {
            req.body.donar = user?._id;
        }
        //save record
        await inventoryModel.create(req.body);
        // await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Record Added",
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In Create Inventory API',
            error,
        });
    }
};

//GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({
            organization: req.body.userId,
        })
            .populate('donar')
            .populate('hospital')
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get all the records successfully",
            inventory,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get All Inventory",
            error,
        });
    }
};

//GET Hospital BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find(
            req.body.filters
        )
            .populate('donar')
            .populate('hospital')
            .populate('organization')
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get hospital records successfully",
            inventory,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get consumer Inventory",
            error,
        });
    }
};

// Get Blood Records of 3
const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({
            organization: req.body.userId,
        }).limit(3).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: 'recent Inventory Data',
            inventory,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Recent Inventory API',
            error,
        })
    }
}


// Get Donar Records
const getDonarsController = async (req, res) => {
    try {
        const organization = req.body.userId
        //find donars
        const donarId = await inventoryModel.distinct("donar", {
            organization,
        });
        // console.log(donarId);

        const donars = await userModel.find({ _id: { $in: donarId } })
        return res.status(200).send({
            success: true,
            message: 'Donar Record Fetched Successfully',
            donars,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in Donar Records",
            error,
        });
    }
};

const getHospitalController = async (req, res) => {
    try {
        const organization = req.body.userId

        // Get Hospital ID
        const hospitalId = await inventoryModel.distinct('hospital', { organization })
        // Find Hospital
        const hospitals = await userModel.find({
            _id: { $in: hospitalId }
        })
        return res.status(200).send({
            success: true,
            message: "Hospital Data Fetched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in get Hospital API',
            error,
        })
    }
};

// Get ORG Profiles
const getOrganizationController = async (req, res) => {
    try {
        const donar = req.body.userId
        const orgId = await inventoryModel.distinct('organization', { donar })

        // Find ORG
        const organizations = await userModel.find({
            _id: { $in: orgId }
        })
        return res.status(200).send({
            success: true,
            message: 'ORG data fetched Successfully',
            organizations,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in ORG API',
            error,
        })
    }
};

// Get ORG for Hospital Profiles
const getOrganizationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId
        const orgId = await inventoryModel.distinct('organization', { hospital })

        // Find ORG
        const organizations = await userModel.find({
            _id: { $in: orgId }
        })
        return res.status(200).send({
            success: true,
            message: 'Hospital ORG data fetched Successfully',
            organizations,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital ORG API',
            error,
        })
    }
};
module.exports = { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganizationController, getOrganizationForHospitalController, getInventoryHospitalController, getRecentInventoryController };