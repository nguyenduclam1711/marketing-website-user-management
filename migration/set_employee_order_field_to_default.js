const Employee = require("../models/employee");
exports.migration = async () => {
    try {
        let index = 0
        const employees = await Employee.find()
        await Promise.all(employees.map(async employee => {
            if (employee.order == null) {
                index++
                employee.order = 999
                employee.save()
            }
        }))
        return `Migration successful. Processed ${employees.length} documents, changed ${index}.`
    } catch (error) {
        console.log('error', error);
    }
}