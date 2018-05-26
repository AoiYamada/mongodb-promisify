# mongodb-promisify
A promisified class for npm mongodb lib:

https://www.npmjs.com/package/mongodb

## Installation
```bash
npm i mongodb-promisify --save
```

## Examples
Create Instance
```javascript
const { MongoDb } = require('mongodb-promisify');

const db = new MongoDb({
    "URL": "mongodb://localhost:27017",
    "OPTIONS": {
        "poolSize": 5,
        "auth": {
            "user": "admin",
            "password": "4?!1BX=Sc*8L"
        }
    }
}, 'test');
```

Create Record
```javascript
(async() => {
    const rows_number = ~~(100 * Math.random() + 1);
    const dataAry = [];
    for (let i = 0; i < rows_number; i++)
        dataAry.push({ test: ~~(1000 * Math.random()) });
    const result = await db.Create(collection, dataAry);
    /**
     * expect(result).to.be.a('object');
     * should.exist(result.ok);
     * expect(result.ok).equal(1);
     * should.exist(result.n);
     * expect(result.n).equal(dataAry.length);
     */
})();
```

Read Data
```javascript
(async() => {
    const results = await db.Read(collection);

    console.log(results);
    /**
     * It should be an array of objects
     */
})();
```

Delete Data
```javascript
(async() => {
    const result = await db.Delete(collection, {});
    /**
     * expect(result).to.be.a('object');
     * should.exist(result.ok);
     * expect(result.ok).equal(1);
     * should.exist(result.n);
     * expect(result.n).equal(rows_number);
     */
})();
```

## Test
```bash
npm test
```
