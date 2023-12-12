import express from "express";
import {getCoursesRouter} from "./routes/courses.router";
import {db} from "./db/db";
import {getTestsRouter} from "./routes/tests";
import {getUsersRouter} from "./routes/users.router";
import {RouterPaths} from "./routerPaths";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.__tests__, getTestsRouter(db))
/*app.use("/interesting", getInterestingRouter(db))*/