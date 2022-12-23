import * as cron from 'node-cron';
// hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();

export const setupSolanaCronJobMap = async (): Promise<void> => {
    const determineJob = cron.schedule('* * * * *', async () => {
        try {
          
            
        } catch (e) {
            console.error('determineJob Error: ', e);
        }
    }, { scheduled: false }).start();

    const refundStatusUpdateJob = cron.schedule('* * * * *', async () => {
        try {
        
        } catch (e) {
            console.error('refundStatusUpdateJob Error: ', e);
        }
    }, { scheduled: false }).start();

   

   
};
