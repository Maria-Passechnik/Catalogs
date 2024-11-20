import { Model } from 'mongoose';
import { logger } from 'src/config/logger.config';

export async function performBatchBulkWrite(
  model: Model<any>,
  operations: any[],
  batchSize = 1000,
) {
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);

    try {
      const result = await model.bulkWrite(batch);
      logger.info(`Batch ${i / batchSize + 1} executed successfully`, result);
    } catch (error) {
      logger.error(`Error in batch ${i / batchSize + 1}`);
    }
  }
}
