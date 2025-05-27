const Jobs = require("../model/jobModel")

//Add job controller
exports.addJobController = async (req, res) => {

    const { title, location, jtype, salary, qualification, experience, description } = req.body

    console.log(title, location, jtype, salary, qualification, experience, description)
    try {
        const existingJob = await Jobs.findOne({ title, location })
        if (existingJob) {
            res.status(400).json('job already exist')
        }
        else {
            const newjob = new Jobs({
                title, location, jtype, salary, qualification, experience, description
            })
            await newjob.save()
            res.status(200).json(newjob)
        }

    } catch (error) {
        res.status(500).json(error)
    }

}

//get alljob
exports.getAllJobController = async (req, res) => {
    const searchkey = req.query.search
    console.log(searchkey)
    try {
        const allJobs = await Jobs.find({ title: { $regex: searchkey, $options: 'i' } })
        res.status(200).json(allJobs)

    } catch (error) {
        res.status(500).json(error)
    }


}

//delete a job
exports.deleteAJobController = async (req, res) => {
    const { id } = req.params
    try {

        await Jobs.findByIdAndDelete({ _id: id })
        res.status(200).json('delete sucessfully')
    } catch (error) {
        res.status(500).json(error)
    }

}