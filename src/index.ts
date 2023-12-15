import {app} from "./app";
import {Server} from "http";

const port = 3000

const server: Server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
