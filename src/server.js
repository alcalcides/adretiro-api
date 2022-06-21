import 'dotenv/config'
import app from "./app.js";

const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log("ok " + new Date());
    console.log(`App running in the port ${port}`)
})