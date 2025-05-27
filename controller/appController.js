const applications = require("../model/appModel")

//add application
exports.addApplicationController = async (req, res) => {
    const { fullname, jobtitle, qualification, email, phone, coverletter } = req.body
    const resume = req.file.filename

    console.log(fullname, jobtitle, qualification, email, phone, coverletter)
    console.log(resume)
    try {
        const existingApplicatnt = await applications.findOne({ jobtitle, email })
        if (existingApplicatnt) {
            res.status(400).json('Applicant already exist')
        }
        else {
            const newapplicant = new applications({
                fullname, jobtitle, qualification, email, phone, coverletter, resume
            })
            await newapplicant.save()
            res.status(200).json(newapplicant)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//request to get all application
exports.getAllApplicationControoler=async(req,res)=>{
    try{

        const allApplications=await applications.find()
        res.status(200).json(allApplications)
    }catch(error){
        res.status(500).json(error)
    }
}