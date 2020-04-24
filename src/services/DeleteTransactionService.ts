// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const deleteTransactions = await transactionsRepository.findOne(id);

    if (!deleteTransactions) {
      throw new Error('Not exist transactions');
    }

    await transactionsRepository.remove(deleteTransactions);
  }
}

export default DeleteTransactionService;
