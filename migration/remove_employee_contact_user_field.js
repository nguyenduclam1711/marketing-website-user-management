const Employee = require("../models/employee");
exports.migration = async () => {
    try {
        let index = 0
        const res = await Employee.find({ contact_user: { $exists: 1 } })
        await Promise.all(res.map(async res => {
            res.set('contact_user', undefined, { strict: false })
            await res.save()
            index++
        }))
        return `Migration successful. Processed ${employees.length} documents, changed ${index}.`
    } catch (error) {
        console.log('error', error);
    }
}