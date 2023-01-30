require('dotenv').config()
const nconf = require('nconf');

// nconf
nconf.argv().env()

const NODE_ENV = nconf.get('NODE_ENV');
const PORT = nconf.get('PORT');
const MONGODB_URI = NODE_ENV === 'production'
                                  ?
                                  nconf.get('MONGODB_URI')
                                  : 
                                  NODE_ENV === 'development'
                                    ? 
                                    nconf.get('MONGODB_URI_DEV') 
                                    :
                                    'mongodb://localhost:27017/BLOG_DB_TEST';

module.exports = { NODE_ENV, PORT, MONGODB_URI };