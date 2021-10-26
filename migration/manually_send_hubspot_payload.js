//TODO run this in terminal to get a dump of all the contacts as json
// ssh dci @95.217.184.232 - L 27018: localhost: 27017
// mongoexport  --port=27018 --collection=contacts --db=marketing-website --out=migration/contacts.json
// format the file as json array which is wrapped in [] and have a , after each line

//TODO for performant filtering not matching lines (total 18000) run this in VIM. This example deletes all lines that not contain cro_test and unemployed yes.
// Delete all lines that not contain cro_test and unemployed yes
// :g!/cro_test_id=86/d

// Delete all lines that not contain unemployed yes
// :g!/unemploye":"yes/d

// Change the actual wrong field
// :%s/yes/Yes/g

//TODO finally run the migration in the terminal 
// node migration/runner.js manually_send_hubspot_payload.js

const requestPromise = require("request-promise");
const contacts = require('./contacts.json')
console.log('contacts', contacts);

exports.migration = async () => {
    try {
        contacts
            // .splice(1, 2)
            .map(async contact => {
                console.log('contact', contact);
                const email = contact.properties.find(p => p.property === "email").value
                // const checkIfContactExistsURL = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`
                // var options = {
                //     method: 'GET',
                //     url: checkIfContactExistsURL,
                //     qs: { hapikey: process.env.HUBSPOT_API_KEY },
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     // body: {
                //     // 	properties: contact,
                //     // },
                //     json: true
                // };
                // try {
                // hubspotPromise = await requestPromise(options)
                // console.log('Contact exists', hubspotPromise.vid);

                // } catch (error) {
                // console.log(`Contact ${email} doesn\'t exist`);
                // if (error.error.message === "contact does not exist") {
                const createURL = `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`
                var options = {
                    method: 'POST',
                    url: createURL,
                    qs: { hapikey: process.env.HUBSPOT_API_KEY },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        properties: contact.properties,
                    },
                    json: true
                };
                hubspotPromise = await requestPromise(options)
                console.log('Contact updated ', hubspotPromise.vid);
                // }
                // }
            })
        return `seemed to work`
    } catch (error) {
        console.log('error', error);
    }
}