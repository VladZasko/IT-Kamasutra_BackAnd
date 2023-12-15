import request from 'supertest'
import {CreateCourseModel} from "../../src/features/curses/models/CreateCurseModel";
import {UpdateCourseModel} from "../../src/features/curses/models/UpdateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {RouterPaths} from "../../src/routerPaths";
import {Server} from "http";
import supertest from "supertest";
import {courseTestManager} from "./utils/cursesTestManager";
import {usersTestManager} from "./utils/usersTestManager";

const getRequest = () => {
    return request(app)
}
describe('/course' , () => {
     beforeAll(async() => {
            await getRequest().delete('/__tests__/data')
    })

    it('should return 200 and empty array',  async () => {
        await getRequest()
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 fot not existing entity',  async () => {
        await getRequest()
            .get(`${RouterPaths.courses}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create entity with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}

        await courseTestManager.createCourse(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdEntity1:any = null
    it(`should create entity with correct input data`, async () => {

        const data: CreateCourseModel = { title: 'it-incubator course'}

        const result = await courseTestManager.createCourse(data)

        createdEntity1 = result.createdEntity;

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    })

    let createdEntity2: any = null
    it(`created one more entity`, async () => {

        const data: CreateCourseModel = { title: 'it-incubator course 2'}

        const result = await courseTestManager.createCourse(data)

        createdEntity2 = result.createdEntity;

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2])
    })

    it(`shouldn't update entity with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}

        await request(app)
            .put(`${RouterPaths.courses}/${createdEntity1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.courses}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity1)
    })

    it(`shouldn't update entity that not exist`, async () => {

        await request(app)
            .put(`${RouterPaths.courses}/${-100}`)
            .send({ title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it(`should update entity with correct input module`, async () => {
        const data: UpdateCourseModel = { title: 'good new title'}

        await request(app)
            .put(`${RouterPaths.courses}/${createdEntity1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdEntity1,
                title: data.title
            })

        await request(app)
            .get(`${RouterPaths.courses}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity2)
    })

    it(`should delete both entity`, async () => {

        await request(app)
            .delete(`${RouterPaths.courses}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.courses}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.courses}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    afterAll(done => {
        done()
    })


})