const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const path = require('path');
const CWD = process.cwd();

const { MongoDb } = require(path.join(CWD, 'MongoDb'));

const db = new MongoDb({
    "URL": "mongodb://localhost:27017",
    "OPTIONS": {
        "poolSize": 5,
        "auth": {
            "user": "admin",
            "password": "4?!1BX=Sc*8L"
        },
        // "useNewUrlParser": true
    }
}, 'test');

const collection = 'collection';

describe('MongoDb', () => {
    const rows_number = ~~(100 * Math.random() + 1);
    it('Create Data to DB', async() => {
        try {
            const dataAry = [];
            for (let i = 0; i < rows_number; i++)
                dataAry.push({ test: ~~(1000 * Math.random()) });
            const result = await db.Create(collection, dataAry);
            expect(result).to.be.a('object');
            should.exist(result.ok);
            expect(result.ok).equal(1);
            should.exist(result.n);
            expect(result.n).equal(dataAry.length);
        } catch (err) {
            should.not.exist(err.message || err);
        }
    });

    it('Read Data From DB', async() => {
        try {
            const results = await db.Read(collection);
            expect(results).to.be.an('array');
            expect(results.length).equal(rows_number);
            should.exist(results[0]);
            expect(results[0]).to.be.a('object');
            should.exist(results[0]._id);
            should.exist(results[0].test);
        } catch (err) {
            should.not.exist(err.message || err);
        }
    });

    it('Delete Data in DB', async() => {
        try {
            await db.Delete(collection);
        } catch (err) {
            should.exist(err.message);
            expect(err.message).equal('Unspecified Query will truncate the collection, please set it be {} if it is the case.');
        }
        try {
            const result = await db.Delete(collection, {});
            expect(result).to.be.a('object');
            should.exist(result.ok);
            expect(result.ok).equal(1);
            should.exist(result.n);
            expect(result.n).equal(rows_number);
        } catch (err) {
            should.not.exist(err.message || err);
        }
    });

    after(async() => {
        try {
            expect(await db.Close()).equal(null);
        } catch (err) {
            should.not.exist(err);
        }
    });
});