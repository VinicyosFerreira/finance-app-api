import { PostgresHelper } from '../../../db/postgres/helper';

export class updateTransactionRepository {
  async execute(transactionId, updateTransactionParams) {
    // Criar 2 variáveis para armazenar a query
    const updateFields = [];
    const updateValues = [];

    // Percorrer o objeto updateTransactionParams e montar a query
    // Object keys - percorre o objeto e retorna as chaves num array
    // forEach - percorre cada chave apenas(key), não pecorre os values e objeto inteiro
    Object.keys(updateTransactionParams).forEach((key) => {
      updateFields.push(`${key} = $${updateFields.length + 1}`);
      updateValues.push(updateTransactionParams[key]);
    });

    // Adicionar o ID do usuário na query
    updateValues.push(transactionId);

    // Realizar a query de atualização de forma dinâmica
    const updateQuery = `
                UPDATE transaction
                SET ${updateFields.join(', ')}
                WHERE ID = $${updateValues.length}
                RETURNING *
            `;

    // Executar a query
    const updateTransaction = await PostgresHelper.query(
      updateQuery,
      updateValues
    );

    // Retornar o usuário atualizado
    return updateTransaction[0];
  }
}
