const assert = require('assert');
require("dotenv").config({ path: __dirname + "/../.env" });
var expect = require("chai").expect;
var chai = require("chai"),
  chaiHttp = require("chai-http");
chai.use(chaiHttp);
var request = require("supertest");
const Course = require("../models/course");
const Page = require("../models/page");

var server = require("../server");
const course_mocks = require('./mocks/course_mock.json')
const page_mock = require('./mocks/page_mock.json')

describe("Basic DOM tests", function () {
  before('Displays course page', async () => {
    await Course.insertMany(course_mocks)
    await Page.insertMany(page_mock)
  })
  it('Landingpage', async () => {
    await request(server)
      .get('/')
      .expect(200)
      .expect((response) => {
        assert.ok(response.text.includes('AWS re/Start Program'));
        assert.ok(response.text.includes('Web Development'));
      });
  });
  it('Course page', async () => {
    await request(server)
      .get('/courses/aws-re-start-program')
      .expect(200)
      .expect((response) => {
        response.text
        assert.ok(response.text.includes('AWS re/Start Program'));
      });
  });
  it('FAq pages', async () => {
    await request(server)
      .get('/pages/faqs')
      .expect(200)
      .expect((response) => {
        console.log(page_mock[0].content)
        console.log('response.text', response.text);
        assert.ok(response.text.includes('What are the financing options for the course'));
      });
  });
  it("404 everything else", function testPath(done) {
    request(server)
      .get("/foo/bar")
      .expect(404)
      .end(function (err, res) {
        res.text.includes("Oops");
        done();
      })
  });
  after(async function () {
    const res = await Course.remove()
  })
});
