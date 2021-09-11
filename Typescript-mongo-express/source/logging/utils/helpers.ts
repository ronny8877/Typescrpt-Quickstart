import fs from "fs";
import colors from "colors";
import Logger from "../logger";

//a function to delete half old data of the log file
const NAMESPACE = "IN_LOGGER";
let log: Logger = new Logger(NAMESPACE);

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
class LogUtils {
  private filePath: string;
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  //a function to diplay all the folders in the LOG_FOLDER_PATH address
  displayFolders() {
    fs.readdir(this.filePath, (err, files) => {
      if (err) {
        log.error(err);
      } else {
        files.forEach((file) => {
          log.general(file);
        });
      }
    });
  } //end of displayFolders

  thanosSnap(fileName: string) {
    //remove all the older log entires from the log file and reduce the entries to half.
    let fileData = fs.readFileSync(this.filePath + fileName, "utf8");
    let lines = fileData.split("\n");
    let halfLines = lines.slice(lines.length / 2, lines.length);
    let halfData = halfLines.join("\n");
    fs.writeFileSync(this.filePath + fileName, halfData);
  }

  //a function to delete all data of the log file
  deleteLogData(fileName: string) {
    fs.writeFileSync(this.filePath + fileName, "");
  } //end of deleteLogFile

  //function to get latest logs
  getLastEntries(fileName: string, entries: number) {
    let fileData = fs.readFileSync(this.filePath + fileName, "utf8");
    let lines = fileData.split("\n");
    let lastEntries = lines.slice(lines.length - entries, lines.length);
    console.log(colors.italic.cyan(lastEntries.join("\n")));
    return lastEntries;
  } //end of getLastEntries

  //self destruct function that delete the log folder
  selfDestruct() {
    //if file dose not exist just return,
    if (fs.existsSync(this.filePath) === false) return;
    fs.rmdirSync(this.filePath, { recursive: true });
    log.general("Log folder deleted");
  } //end of selfDestruct

  //delete a backup file
  deleteLogFile(fileName: string) {
    try {
      fs.unlinkSync(this.filePath + fileName);
      log.warn(fileName + " Removed Successfully");
    } catch (error: any) {
      log.error(error.message);
    }
  } //end of deleteBackupFile

  // a method to create a backup of the given file in the backup folder
  backupLogFile(fileName: string) {
    //creates a backup in the root folder so you i can delete backup-files without any worries.
    //it overwrites the backup file if it already exists.
    fs.copyFileSync(this.filePath + fileName, "./backup/" + fileName);
    log.success("Backup created");
  } //end of backupFile

  //a method to create back-up of all the files in log directory
  backupAllLogFiles() {
    fs.readdir(this.filePath, (err, files) => {
      if (err) {
        log.error(err);
      } else {
        files.forEach((file) => {
          this.backupLogFile(file);
        });
      }
    });
  } //end of backupAllLogFiles
}

export default LogUtils;
