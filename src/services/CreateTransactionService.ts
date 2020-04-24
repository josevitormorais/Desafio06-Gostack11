import Transaction from '../models/Transaction';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    //REEEEEQUISSSSSSICOEEEES QUE VAO AO BANCO DEVEM INCIAR O AAAAWAIT
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let ExistCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!ExistCategory) {
      ExistCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(ExistCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: ExistCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
