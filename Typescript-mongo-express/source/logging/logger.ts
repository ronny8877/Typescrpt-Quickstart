import fs from "fs";
import colors from "colors";
import dayjs from "dayjs";
dayjs.extend(require("dayjs/plugin/localizedFormat"));
//TODO: WRITE PROPER COMMENTS

class Logger {
  //variables
  private NAMESPACE: string;
  constructor(namespace: string) {
    this.NAMESPACE = namespace;
  }

  //methods

  private getTimeStamp = () => {
    return new Date().toISOString();
  };

  //function to format date and time
  //type any because it can be a direct date or a return from a function
  private formatTimeStamp = (date: any) => {
    // LT	h:mm A	8:02 PM
    // LTS	h:mm:ss A	8:02:18 PM
    // L	MM/DD/YYYY	08/16/2018
    // LL	MMMM D, YYYY	August 16, 2018
    // LLL	MMMM D, YYYY h:mm A	August 16, 2018 8:02 PM
    // LLLL	dddd, MMMM D, YYYY h:mm A	Thursday, August 16, 2018 8:02 PM
    // l	M/D/YYYY	8/16/2018
    // ll	MMM D, YYYY	Aug 16, 2018
    // lll	MMM D, YYYY h:mm A	Aug 16, 2018 8:02 PM
    // llll	ddd, MMM D, YYYY h:mm A	Thu, Aug 16, 2018 8:02 PM
    return dayjs(date).format("L LTS");
  };

  //color functions for different levels
  //todo: add some fancy formatting and features to each functions
  private warnColor = (message: string, object?: Object) => {
    if (object) {
      console.warn(colors.bold.yellow(message), object);
    } else {
      console.warn(colors.bold.yellow(message));
    }
  };

  private errorColor = (message: string, object?: Object) => {
    if (object) {
      console.error(colors.bold.red(message), object);
    } else {
      console.warn(colors.bold.red(message));
    }
  };

  private successColor = (message: string, object?: Object) => {
    if (object) {
      console.error(colors.bold.green(message), object);
    } else {
      console.warn(colors.bold.green(message));
    }
  };

  private infoColor = (message: string, object?: Object) => {
    if (object) {
      console.warn(colors.blue(message), object);
    } else {
      console.warn(colors.blue(message));
    }
  };

  private generalColor = (message: string, object?: Object) => {
    if (object) {
      console.warn(colors.bgMagenta(message), object);
    } else {
      console.warn(colors.bgMagenta(message));
    }
  };

  //temporary-> function to log to console
  private log(
    level: string,

    message: any,
    fun: Function,
    object?: any,
    fileName?: string
  ) {
    if (object) {
      fun(
        `[${this.formatTimeStamp(this.getTimeStamp())}] [${level}] [${
          this.NAMESPACE
        }] ${message}`,
        object
      );
      this.writeToLogFile(level, message, object, fileName);
    } else {
      fun(
        `[${dayjs(this.getTimeStamp()).format("L LTS")}] [${level}] [${
          this.NAMESPACE
        }] ${message}`
      );
      this.writeToLogFile(level, message, fileName);
    }
  }

  private writeToLogFile = (
    level: string,
    message: string,
    object?: any,
    fileName?: string
  ) => {
    //if filename exists then use it else use levels as filename

    const logFile = fileName ? fileName : `${level.toLowerCase()}.log`;
    const logFilePath = `logs/`;

    //checking if log folder exist if not creating one
    if (!fs.existsSync(logFilePath)) {
      fs.mkdirSync(logFilePath, {
        recursive: true,
      });
    }
    //if the log file exist then appending the log to the file
    if (object) {
      //todo:some ERROR handling
      fs.appendFileSync(
        logFilePath + logFile,
        `[${this.getTimeStamp()}] [${level}] [${
          this.NAMESPACE
        }] ${message} ${JSON.stringify(object)}\n`
      );
    } else {
      //todo:some ERROR handling
      fs.appendFileSync(
        logFilePath + logFile,
        `[${this.getTimeStamp()}] [${level}] [${this.NAMESPACE}] ${message}\n`
      );
    }
  };

  info = (message: any, object?: any, fileName?: string) => {
    const level = "INFO";
    fileName = fileName ? fileName : `${level.toLowerCase()}.log`;
    this.log(level, message, this.infoColor, object);
  };

  error = (message: any, object?: any, fileName?: string) => {
    const level = "ERROR";
    fileName = fileName ? fileName : `${level.toLowerCase()}.log`;
    this.log(level, message, this.errorColor, object);
  };
  success = (message: any, object?: any, fileName?: string) => {
    const level = "SUCCESS";
    fileName = fileName ? fileName : `${level.toLowerCase()}.log`;
    this.log(level, message, this.successColor, object);
  };
  warn = (message: any, object?: any, fileName?: string) => {
    const level = "WARN";
    fileName = fileName ? fileName : `${level.toLowerCase()}.log`;
    this.log(level, message, this.warnColor, object);
  };

  general = (message: any, object?: any, fileName?: string) => {
    const level = "GENERAL";
    fileName = fileName ? fileName : `${level.toLowerCase()}.log`;
    this.log(level, message, this.generalColor, object);
  };

  debug = (message: any, level: string, object?: any, fileName?: string) => {
    //if fileName is not specified then use the default
    fileName = fileName ? fileName : `debug.log`;
    //workaround for the debug log
    level = !level ? "DEBUG" : level.toUpperCase();
    //if level is other than info,error,success,warn, debug then it will throw an exception
    if (
      level !== "INFO" &&
      level !== "ERROR" &&
      level !== "SUCCESS" &&
      level !== "WARN" &&
      level !== "DEBUG"
    ) {
      throw new Error("Invalid level");
    }

    this.log(level, message, this.generalColor, object, fileName);
  };
}

export default Logger;
