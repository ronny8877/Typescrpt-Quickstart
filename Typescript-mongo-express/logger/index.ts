import chalk from 'chalk';
import dayjs from 'dayjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface LogsInput {
  color: string;
  level: number;
}

interface Configs {
  writeLogsToFile?: boolean;
  datedLogs?: boolean;
  dateFormate?: string;
  fileDatePrefixFormat?: string;
  showLevel?: boolean;
  path?: string;
  info?: LogsInput;
  error?: LogsInput;
  warn?: LogsInput;
  debug?: LogsInput;
  trace?: LogsInput;
  fatal?: LogsInput;
  success?: LogsInput;
  rainbow?: LogsInput;
}

const configs = {
  writeLogsToFile: false,
  datedLogs: true,
  dateFormate: 'YY-MM-DD:HH:mm:ss',
  fileDatePrefixFormat: 'YYYY-MM-DD',
  path: '../logs',
  showLevel: true,

  success: {
    color: 'green',
    level: 6,
  },
  info: {
    color: 'cyan',
    level: 0,
  },
  error: {
    color: 'red',
    level: 1,
  },
  warn: {
    color: 'yellow',
    level: 2,
  },
  debug: {
    color: 'blue',
    level: 3,
  },
  trace: {
    color: 'cyan',
    level: 4,
  },
  fatal: {
    color: 'magenta',
    level: 5,
  },
  rainbow: {
    color: 'rainbow',
    level: 7,
  },
} satisfies Configs;

type Message = string | object | any | any[];
type Level =
  | 'info'
  | 'error'
  | 'warn'
  | 'debug'
  | 'trace'
  | 'fatal'
  | 'success'
  | 'rainbow';

const init = (config?: Configs) => {
  if (!config) return;
  //Replaced the configs with the new configs
  Object.assign(configs, config);
};

const messageCreator = ({
  message,
  level,
}: {
  level: Level;
  message: Message;
}) => {
  // Fix this spagetti code
  if (typeof message === 'string') {
    return `${chalk.bold.bgBlack.white(
      `[${configs.datedLogs?dayjs().format(configs.dateFormate):'>'}]`,
    )} ${configs.showLevel? 'Level:'+level :'^_^'} : ${message} `;
  } else if (typeof message === 'object' && message instanceof Error) {
    return `[${dayjs().format(
      configs.dateFormate,
    )}] Level:${level} : ${chalk.redBright(chalk.white(message.stack))} `;
  } else {
    return `[${dayjs().format(
      configs.dateFormate,
    )}] Level: ${level} ${chalk.white(JSON.stringify(message, null, 2))}`;
  }
};

const writer = (level: Level, message: Message) => {
  // if(!writLogs)return
  let fileName = configs.datedLogs
    ? `${level}-${dayjs().format(configs.fileDatePrefixFormat)}`
    : level;
  const logPath = join(__dirname, configs.path);
  if (!existsSync(logPath)) {
    mkdirSync(logPath);
  }
  //removing  from the message
  message = message.replace(/\u001b\[.*?m/g, '');
  const stream = createWriteStream(join(logPath, `${fileName}.log`), {
    flags: 'a',
  });
  stream.write(message + '\n');
  stream.end();
};

const logger = (message: Message, level: Level) => {
  const msg = messageCreator({ level, message });
  if (configs.writeLogsToFile) {
    writer(level, msg);
  }
  if (level === 'fatal') process.exit(1);
  if (level === 'trace')
    return console.error(chalk.keyword(configs[level].color)(msg));
  else console.log(chalk.keyword(configs[level].color)(msg));
};

function rainbowText(text: string): string {
  const rainbowColors: Array<keyof typeof chalk> = [
    'red',
    'yellow',
    'green',
    'blue',
    'magenta',
    'cyan',
  ];
  let rainbowText = '';

  for (let i = 0; i < text.length; i++) {
    const color = rainbowColors[i % rainbowColors.length];
    rainbowText += (chalk[color] as (text: string) => string)(text[i]);
  }

  return rainbowText;
}
const log = {
  init,
  success: (message: Message) => logger(message, 'success'),
  info: (message: Message) => logger(message, 'info'),
  error: (message: Message) => logger(message, 'error'),
  warn: (message: Message) => logger(message, 'warn'),
  debug: (message: Message) => logger(message, 'debug'),
  trace: (message: Message) => logger(message, 'trace'),
  fatal: (message: Message) => logger(message, 'fatal'),
  rainbow: (message: Message) =>
    console.log(chalk.bgBlack(rainbowText(message))),
};

export default log;
