require("dotenv").config({ path: __dirname + "/../.env" });
const Location = require("../models/location");
const request = require("request");
const puppeteer = require('puppeteer');
const email = "thomas.kuhnert@digitalcareerinstitute.org";
const assert = require('assert');
const supertest = require("supertest");
const { url } = require("../helpers/helper.js");
const mongoose = require("mongoose");

const server = require("../server");
(async () => {
    let hubspotContactID
    describe('Contactform and hubspot contact existence', function () {
        before(function (done) {
            mongoose.connection.on("error", console.error.bind(console, "connection error"));
            mongoose.connection.once("open", function () {
                console.log("We are connected to test database!");
                new Location({
                    name: "Berlin",
                    street: "Vulkanstrasse 1",
                    zip: "10243"
                });
                done();
            });
        });
        it('Fills the contact form and submits it', async function () {
            return new Promise(async function (resolve) {
                const browser = await puppeteer.launch({
                    defaultViewport: null,
                    // headless: false,
                    // devtools: true
                });
                const serverInstance = supertest(server).get("/")
                const page = await browser.newPage();
                await page.goto(serverInstance.url + "signup", { waitUntil: 'networkidle2' });
                page.waitForNavigation()
                let submitted = false
                page.waitForSelector('.dynamicinputform')
                    .then(async () => {
                        const recursiveClick = async (submitButton) => {
                            await page.evaluate(() => {
                                const dropdowns = document.querySelectorAll('select');
                                if (dropdowns.length > 0) {
                                    Array.from(dropdowns).map(dropdown => {
                                        const dropdownOptions = dropdown.querySelectorAll('option');
                                        const selected_option = [...dropdownOptions][2]
                                        selected_option.selected = true;
                                    })
                                }
                            });
                            await page.evaluate(() => {
                                const numberInput = document.querySelector('input[type="number"]');
                                if (numberInput) {
                                    numberInput.value = 33;
                                }
                            });
                            await page.evaluate(() => {
                                const textInputs = document.querySelectorAll('input[type="text"]:not(.answerbutton)');
                                if (textInputs.length > 0) {
                                    Array.from(textInputs).map(textInput => {
                                        if (textInput) {
                                            textInput.value = "Testvalue";
                                        }
                                    })
                                }
                            });
                            await page.evaluate(() => {
                                const emailInputs = document.querySelectorAll('input[type="email"]:not(.answerbutton)');
                                if (emailInputs.length > 0) {
                                    Array.from(emailInputs).map(emailInput => {
                                        if (emailInput) {
                                            emailInput.value = "thomas.kuhnert@digitalcareerinstitute.org";

                                        }
                                    })
                                }
                            });
                            await page.evaluate(() => {
                                const telInputs = document.querySelectorAll('input[type="tel"]:not(.answerbutton)');
                                if (telInputs.length > 0) {
                                    Array.from(telInputs).map(telInput => {
                                        if (telInput) {
                                            telInput.value = 1234567890;
                                        }
                                    })
                                }
                            });
                            let elHandleArray = await page.$$('input')
                            if (elHandleArray[0]) {
                                await elHandleArray[0].click()
                            }
                            await page.evaluate(() => {
                                let nextButton = document.querySelector('.answerbutton')
                                if (nextButton) {
                                    nextButton.click()
                                }
                            })
                            if (submitButton[0]) {
                                submitted = true
                                const TermsofService = await page.$('input[name="TermsofService"]');
                                TermsofService.click();
                                await page.waitForTimeout(1000); // wait for 5 seconds
                                await submitButton[0].click()
                                page.on('response', async (response) => {
                                    if (response.url() == `${serverInstance.url}contact`) {
                                        console.log('XHR response received');
                                        const responseJson = await response.json()
                                        console.log('responseJson', responseJson.response.contact_id);
                                        if (responseJson.response.contact_id) {
                                            assert(responseJson.response.contact_id)
                                            browser.close()
                                            resolve();
                                        }
                                    }
                                });
                            } else {
                                if (!submitted) {
                                    await page.waitForTimeout(1000);
                                    const nextSubmitButton = await page.$$('[data-nextquestions=""]')
                                    recursiveClick(nextSubmitButton)
                                }
                            }
                        }
                        const submitButton = await page.$$('[data-nextquestions=""]')
                        recursiveClick(submitButton)
                    });
            });
        })
        it('Checks if Hubspot contains the new contact and the jobcenter field', async function () {
            return new Promise(async function (resolve) {
                var options = {
                    method: 'GET',
                    url: `https://api.hubapi.com/contacts/v1/contact/email/thomas.kuhnert@digitalcareerinstitute.org/profile`,
                    qs: { hapikey: process.env.HUBSPOT_API_KEY }
                }
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    assert.equal(JSON.parse(body).properties.phone.value, '+491234567890')
                    assert.equal(JSON.parse(body).properties.firstname.value, 'Testvalue')
                    assert.equal(JSON.parse(body).properties.age.value, '33')
                    hubspotContactID = JSON.parse(body).vid
                    var options = {
                        method: 'DELETE',
                        url: `https://api.hubapi.com/contacts/v1/contact/vid/${hubspotContactID}`,
                        qs: { hapikey: process.env.HUBSPOT_API_KEY }
                    }
                    request(options, function (errorDelete, responseDelete, bodyDelete) {
                        if (errorDelete) throw new Error(errorDelete);
                        assert.equal(JSON.parse(bodyDelete).vid, hubspotContactID)
                        resolve();
                    });
                });
            });
        });
    });
})();