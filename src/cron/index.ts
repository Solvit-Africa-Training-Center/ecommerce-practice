import cron from 'node-cron';
import { checkProductStock } from './checkProductStock';

export const initCronJobs = ():void => {
  cron.schedule('* * * * *', checkProductStock);
};
