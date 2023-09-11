import dotenv from 'dotenv';
import express,{Response} from 'express';
import errorHandler from './app/middlewares/error-handler';
import UserRouter from './app/routes/user.route';
dotenv.config();
//Let the fun begin
import { DB } from './init/db.init';
import log from './logger';
//Log config
log.init({
writeLogsToFile: true,
showLevel: false,
dateFormate: 'HH:mm:ss',
// datedLogs: false,
})
DB.getInstanceAndConnect();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/user",UserRouter); 



app.listen(process.env.PORT, () => {
    log.rainbow(`Server listening on port ${process.env.PORT}`);
});

app.use(errorHandler);

export default app;