require("dotenv").config({ path: __dirname + "/../.env" });
const Question = require("../models/question");
const request = require("request");
const puppeteer = require('puppeteer');
const assert = require('assert');
const supertest = require("supertest");
const test_mail = "thomas.kuhnert+test@digitalcareerinstitute.org"
const app = require("../index");
let browser
(async () => {
    let hubspotContactID
    describe('Contactform and hubspot contact existence', function () {
        before(async function () {
            return new Promise(async resolve => {
                app.on("app_started", async function () {
                    const questions = await Question.find()
                    try {
                        if (questions.length === 0) {
                            console.log("No questions found in database. Fetching and reating questions...")
                            var options = {
                                method: 'GET',
                                "content-type": "application/json",
                                url: 'https://digitalcareerinstitute.org/admin/questions/fetch/student',
                                qs: { hapikey: process.env.HUBSPOT_API_KEY }
                            }
                            request(options, async function (error, response, body) {
                                const json = JSON.parse(response.body);
                                if (error) throw new Error(error);
                                studen_question_mock = json.payload.questions
                                delete studen_question_mock._id
                                delete studen_question_mock._v
                                await Question.create(studen_question_mock);
                            });
                        }
                    } catch (error) {
                        console.log('error', error);
                        reject(error)
                    } finally {
                        resolve()
                    }
                })
            });
        })
        it('Fills the contact form and submits it', async function () {
            return new Promise(async function (resolve, reject) {
                browser = await puppeteer.launch({
                    defaultViewport: null,
                    // headless: false,
                    // devtools: true,
                    dumpio: true,
                    args: [
                        `--no-sandbox`,
                    ],
                });
                const serverInstance = supertest(app).get("/")
                const page = await browser.newPage();
                await page.goto(serverInstance.url + "signup", { waitUntil: 'networkidle2' });
                page.waitForNavigation()
                let submitted = false
                page.waitForSelector('.dynamicinputform')
                    .then(async () => {
                        const example = await page.$('.navbar-brand');
                        const bounding_box = await example.boundingBox();

                        await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
                        await page.mouse.down();
                        await page.mouse.move(126, 19);
                        await page.mouse.up();

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
                            await page.evaluate((email) => {
                                const emailInputs = document.querySelectorAll('input[type="email"]:not(.answerbutton)');
                                if (emailInputs.length > 0) {
                                    Array.from(emailInputs).map(async emailInput => {
                                        if (emailInput) {
                                            emailInput.value = email;
                                        }
                                    })
                                }
                            }, test_mail);
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
                                try {
                                    submitted = true
                                    await page.$eval('input[name="TermsofService"]', check => check.checked = true);
                                    await page.waitForTimeout(3000); // wait for 5 seconds
                                    await page.evaluate(() => {
                                        let button = document.querySelector('button[type="submit"]')
                                        if (button) {
                                            button.click()
                                        }
                                    });
                                    await Promise.all([
                                        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                                        page.waitForNavigation({ waitUntil: 'load' }),
                                        page.waitForSelector('h1'),
                                    ]);
                                    const heading1 = await page.$eval("h1", el => el.textContent);
                                    if (heading1 === "Thank you for applying!") {
                                        resolve()
                                    } else {
                                        reject('Error in Thank you page redirect')
                                    }
                                } catch (error) {
                                    reject(error);
                                }
                            } else {
                                if (!submitted) {
                                    await page.waitForTimeout(500);
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
                    url: `https://api.hubapi.com/contacts/v1/contact/email/${test_mail}/profile`,
                    qs: { hapikey: process.env.HUBSPOT_API_KEY }
                }
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    assert.equal(JSON.parse(body).properties.phone.value, '+491234567890')
                    assert.equal(JSON.parse(body).properties.firstname.value, 'Testvalue')
                    assert.equal(JSON.parse(body).properties.age.value, '33')
                    hubspotContactID = JSON.parse(body).vid
                    console.log('hubspotContactID', hubspotContactID);
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
        after(async function () {
            return new Promise(async resolve => {
                if (await Question.find()) {
                    const res = await Question.collection.drop()
                    console.log('Questions cleared');
                }
                console.log('Server closed');
                app.close(resolve)
            })
        });
    });
})();