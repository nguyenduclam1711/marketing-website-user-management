const requestPromise = require("request-promise");
const contacts = require('../missing_leads')

exports.migration = async () => {
    try {
        contacts
            .map(async contact => {
                const email = contact.find(p => p.property === "email").value
                const checkIfContactExistsURL = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`
                var options = {
                    method: 'GET',
                    url: checkIfContactExistsURL,
                    qs: { hapikey: process.env.HUBSPOT_API_KEY },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // body: {
                    // 	properties: contact,
                    // },
                    json: true
                };
                try {
                    hubspotPromise = await requestPromise(options)
                    console.log('Contact exists', hubspotPromise.vid);

                } catch (error) {
                    console.log(`Contact ${email} doesn\'t exist`);
                    if (error.error.message === "contact does not exist") {
                        const createURL = `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`
                        var options = {
                            method: 'POST',
                            url: createURL,
                            qs: { hapikey: process.env.HUBSPOT_API_KEY },
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: {
                                properties: contact,
                            },
                            json: true
                        };
                        hubspotPromise = await requestPromise(options)
                        console.log('Contact created ', hubspotPromise.vid);
                    }
                }
            })
        return `seemed to work`
    } catch (error) {
        console.log('error', error);
    }
}