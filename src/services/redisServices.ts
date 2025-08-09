import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect().catch(console.error);

export const addToBlackList = async (token:string)=>{
	await redisClient.set(token, 'blacklisted', {EX: 36000});
}

export const isBlackListed = async (token:string)=>{

	const result = await redisClient.get(token);
	return result === 'blacklisted';
}