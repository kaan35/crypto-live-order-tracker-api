import { ObjectId } from 'mongodb';
import { redisClient } from '../../app.js';

// Helper function to serialize ObjectId correctly
const serializeObjectId = (document) => {
  if (document?._id instanceof ObjectId) {
    document._id = document._id.toString(); // Convert ObjectId to string
  }
  return document;
};

// Helper function to deserialize ObjectId correctly
const deserializeObjectId = (document) => {
  if (document?._id && typeof document?._id === 'string') {
    document._id = new ObjectId(document._id); // Convert string back to ObjectId
  }
  return document;
};

export const setCache = async (name, data) =>
  await redisClient.setEx(name, 60, JSON.stringify(serializeObjectId(data)));

export const getCache = async (name) =>
  deserializeObjectId(JSON.parse(await redisClient.get(name)));
