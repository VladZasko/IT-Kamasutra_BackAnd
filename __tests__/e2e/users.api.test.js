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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const utils_1 = require("../../src/utils");
const routerPaths_1 = require("../../src/routerPaths");
describe('tests for /users', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/__tests__/data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(routerPaths_1.RouterPaths.users)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 fot not existing course', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/1`)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it(`should'nt create course with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .post(routerPaths_1.RouterPaths.users)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get(routerPaths_1.RouterPaths.users)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdCourse1 = null;
    it(`should create course with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'it-incubator course' };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post(routerPaths_1.RouterPaths.users)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdCourse1 = createResponse.body;
        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: data.title
        });
        yield (0, supertest_1.default)(app_1.app)
            .get(routerPaths_1.RouterPaths.users)
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdCourse1]);
    }));
    let createdCourse2 = null;
    it(`created one more courses`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'it-incubator course 2' };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post(routerPaths_1.RouterPaths.users)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdCourse2 = createResponse.body;
        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        });
        yield (0, supertest_1.default)(app_1.app)
            .get(routerPaths_1.RouterPaths.users)
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
    }));
    it(`should'nt update course with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdCourse1);
    }));
    it(`should'nt update course that not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .put(`${routerPaths_1.RouterPaths.users}/${-100}`)
            .send({ title: 'good title' })
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it(`should update course with correct input module`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good new title' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .expect(utils_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse1), { title: data.title }));
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/${createdCourse2.id}`)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdCourse2);
    }));
    it(`should delete both courses`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/${createdCourse1.id}`)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${routerPaths_1.RouterPaths.users}/${createdCourse2.id}`)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${routerPaths_1.RouterPaths.users}/${createdCourse2.id}`)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get(routerPaths_1.RouterPaths.users)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
});
