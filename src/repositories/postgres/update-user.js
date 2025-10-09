import { PostgresHelper } from '../../db/postgres/helper.js';

export class PostgresUpdateUserRepository {
  async execute(userId, updateUserParams) {
    // Criar 2 variáveis para armazenar a query
    const updateFields = [];
    const updateValues = [];

    // Percorrer o objeto updateUserParams e montar a query
    // Object keys - percorre o objeto e retorna as chaves num array
    // forEach - percorre cada chave apenas(key), não pecorre os values e objeto inteiro
    Object.keys(updateUserParams).forEach((key) => {
      updateFields.push(`${key} = $${updateFields.length + 1}`);
      updateValues.push(updateUserParams[key]);
    });

    // Adicionar o ID do usuário na query
    updateValues.push(userId);

    // Realizar a query de atualização de forma dinâmica
    const updateQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE ID = $${updateValues.length}
        RETURNING *
    `;

    // Executar a query
    const updateUser = await PostgresHelper.query(updateQuery, updateValues);

    // Retornar o usuário atualizado
    return updateUser[0];
  }
}
