const testcontroller = (req,res) => {
res.status(200).send({
    message: "Abhishek",
    success: true,
});
};

module.exports = {testcontroller};