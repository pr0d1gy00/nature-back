"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlackListed = exports.addToBlackList = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.connect().catch(console.error);
const addToBlackList = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(token, 'blacklisted', { EX: 36000 });
});
exports.addToBlackList = addToBlackList;
const isBlackListed = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redisClient.get(token);
    return result === 'blacklisted';
});
exports.isBlackListed = isBlackListed;
