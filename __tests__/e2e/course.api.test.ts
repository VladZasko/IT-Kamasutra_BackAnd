import request from 'supertest'
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";

const getRequest = () => {
    return request(app)
}
describe('/course' , () => {
    beforeAll(async() => {
        await getRequest().delete('/__tests__/data')
    })

    it('should return 200 and empty array',  async () => {
        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 fot not existing course',  async () => {
        await getRequest()
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should'nt create course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1:any = null
    it(`should create course with correct input data`, async () => {

        const data: CreateCourseModel = { title: 'it-incubator course'}

        const createResponse = await request(app)
            .post('/courses/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body;

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses/')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })

    let createdCourse2: any = null
    it(`created one more courses`, async () => {

        const data: CreateCourseModel = { title: 'it-incubator course 2'}

        const createResponse = await request(app)
            .post('/courses/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses/')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it(`should'nt update course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: ''}

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    })

    it(`should'nt update course that not exist`, async () => {

        await request(app)
            .put('/courses/' + -100)
            .send({ title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it(`should update course with correct input module`, async () => {
        const data: UpdateCourseModel = { title: 'good new title'}

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: data.title
            })

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it(`should delete both courses`, async () => {

        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses/')
            .expect(HTTP_STATUSES.OK_200, [])
    })


})