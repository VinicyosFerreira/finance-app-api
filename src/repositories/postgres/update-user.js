import { PostgresHelper } from '../../db/postgres/helper.js';

export class PostgresUpdateUserRepository {
  async execute(userId, updateParams) {
    // Criar 2 variáveis para armazenar a query
    const updateFields = [];
    const updateValues = [];

    // Percorrer o objeto updateParams e montar a query
    // Object keys - percorre o objeto e retorna as chaves num array
    // forEach - percorre cada chave apenas(key), não pecorre os values e objeto inteiro
    Object.keys(updateParams).forEach((key) => {
      updateFields.push(`${key} = $${updateFields.length + 1}`);
      updateValues.push(updateParams[key]);
    });

    // Adicionar o ID do usuário na query
    updateValues.push(userId);

    // Realizar a query de atualização de forma dinâmica
    const updateQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE ID = $${updateValues.length}
    `;

    // Executar a query
    const updateUser = await PostgresHelper.query(updateQuery, updateValues);

    // Retornar o usuário atualizado
    return updateUser[0];
  }
}
