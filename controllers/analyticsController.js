const inventoryModel = require("../models/inventoryModel");
const mongoose = require('mongoose')

// Get Blood Records
const bloodGroupDetailsController = async (req, res) => {
    try {
        const bloodGroups = ['O+', 'O-', 'AB+', 'AB-', 'A+', 'A-', 'B+', 'B-'];
        const bloodGroupData = [];
        const organization = new mongoose.Types.ObjectId(req.body.userId);

        // get single blood group
        await Promise.all(bloodGroups.map(async (bloodGroup) => {
            // Count Total IN
            const totalIn = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: 'in',
                        organization,
                    }
                },
                {
                    $group: {
                        _id: null, total: { $sum: '$quantity' },
                    },

                }

            ]);

            // Count Total OUT
            const totalOut = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: 'out',
                        organization,
                    }
                },
                {
                    $group: {
                        _id: null, total: { $sum: '$quantity' },
                    },

                }

            ]);

            // Calculation for Total
            const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0)

            // Push Data
            bloodGroupData.push({
                bloodGroup,
                totalIn: totalIn[0]?.total || 0,
                totalOut: totalOut[0]?.total || 0,
                availableBlood,
            });
        }))

        return res.status(200).send({
            success: true,
            message: "Blood Group Data Fetch Successfully",
            bloodGroupData,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Bloodgroup Data Analytics API',
            error,
        });
    }
};

module.exports = { bloodGroupDetailsController };