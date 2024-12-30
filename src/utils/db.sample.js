import { MongoClient } from 'mongodb';

const username = encodeURIComponent('');
const password = encodeURIComponent('');
const host = '';
const databaseName = '';

const uri = `mongodb://${username}:${password}@${host}/${databaseName}`;
const client = new MongoClient(uri);

export const database = client.db(databaseName);
