const {
    MongoClient,
    ObjectID
} = require('mongodb');

const connections = Object.create(null);

class MongoDb {
    /**
     * @typedef {Object} DBConfig
     * @property {String} URL - host:port of mongo server
     * @property {Object} OPTIONS
     * @property {Integer} OPTIONS.poolSize - size of connection pool
     * @property {Object} OPTIONS.auth - user and password for auth
     * @property {String} OPTIONS.auth.user - username
     * @property {String} OPTIONS.auth.password - password
     *
     */

    /**
     * Create a Mongodb connection
     * @param {DBConfig} config
     * @param {String} db - db name
     *
     */
    constructor(DBConfig, db) {
        /**
        http://mongodb.github.io/node-mongodb-native/3.0/api/MongoClient.html#.connect
        DBConfig Example:
        {
            "URL": "mongodb://localhost:27017",
            "OPTIONS": {
                "poolSize": 5,
                "auth": {
                    "user": "admin",
                    "password": "12345678",
                },
                // "useNewUrlParser": true
            }
        }
        */

        this._url = DBConfig.URL;

        const host = connections[DBConfig.URL] = connections[DBConfig.URL] || new Promise((resolve, reject) => {
            MongoClient.connect(
                DBConfig.URL,
                DBConfig.OPTIONS,
                (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(client);
                    }
                }
            );
        });

        this._connection = (async() => {
            const client = await host;
            return client.db(db);
        })();
    }

    /**
     * Insert array of data object into mongodb
     * @param {String} collection - collection name
     * @param {Object[]} dataAry - array of data object
     * @return {Promise<Object|Error>} result - details ref. Mongo Client Docs:
     * @return {Object} result
     * @return {Integer} result.ok - 1 for success, 0 for fail
     * @return {Integer} result.n - length of dataAry
     *
     *
     */
    async Create(collection, dataAry) {
        const db = await this._connection;
        const _collection = db.collection(collection);
        return new Promise(async(resolve, reject) => {
            // Insert some documents
            _collection.insertMany(
                dataAry,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.result);
                    }
                }
            );
        });
    }

    /**
     * Find data that match the query from db
     * @param {String} collection - collection name
     * @param {Object} [query={}] - condition to filter data from db
     * @return {Promise<Object[]|Error>} results objects
     *
     */
    async Read(collection, query = Object.create(null)) {
        const db = await this._connection;
        const _collection = db.collection(collection);
        return new Promise(async(resolve, reject) => {
            // Insert some documents
            _collection.find(query).toArray(
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    /**
     * Remove data which match the query from db
     * @param {String} collection - collection name
     * @param {Object} query - condition to filter data from db
     * @return {Object} result
     * @return {Integer} result.ok - 1 for success, 0 for fail
     * @return {Integer} result.n - length of dataAry
     * @throw {Error} if query is undefined, throw 'Unspecified Query will truncate the collection, please set it be {} if it is the case.'
     *
     */
    async Delete(collection, query) {
        if (!query)
            throw new Error('Unspecified Query will truncate the collection, please set it be {} if it is the case.');
        const db = await this._connection;
        const _collection = db.collection(collection);
        return new Promise(async(resolve, reject) => {
            _collection.deleteMany(
                query,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.result);
                    }
                }
            );
        });
    }

    /**
     * testing
     *
     */
    async Distinct(collection, field, query = Object.create(null)) {
        const db = await this._connection;
        const _collection = db.collection(collection);
        return new Promise(async(resolve, reject) => {
            // Insert some documents
            _collection.distinct(
                field,
                query,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    /**
     * testing
     *
     */
    async List() {
        const db = await this._connection;
        return new Promise(async(resolve, reject) => {
            db.listCollections().toArray(
                (err, collections) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(
                            collections
                            .filter(v => v.name.indexOf('system.') === -1)
                            .map(v => v.name)
                        );
                    }
                }
            );
        });
    }

    /**
     * Close the Mongodb connection
     * effect: all client share the same connection will be affected
     *
     */
    async Close() {
        const connection = await connections[this._url];
        connection.close();
        delete connections[this._url];
        delete this._connection;
        return null;
    }
};

module.exports = {
    MongoDb,
    ObjectID
}