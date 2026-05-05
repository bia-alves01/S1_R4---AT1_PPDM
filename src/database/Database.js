import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('contatos.db');

const runSql = (sql, params = []) => Promise.resolve().then(() => db.runSync(sql, params));

const getAllSql = (sql, params = []) => Promise.resolve().then(() => db.getAllSync(sql, params));

export const initDatabase = () =>
    runSql(`
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL
        );
    `);

export const saveContact = (nome, telefone) =>
    runSql('INSERT INTO contatos (nome, telefone) VALUES (?, ?);', [nome, telefone])
        .then((result) => result.lastInsertRowId ?? result.insertId);

export const listContacts = () =>
    getAllSql('SELECT id, nome, telefone FROM contatos ORDER BY nome ASC;');

//Atualizar contato
export const updateContact = (id, nome, telefone) =>
    runSql('UPDATE contatos SET nome = ?, telefone = ? WHERE id = ?;', [nome, telefone, id]);

//Deletar contato
export const deleteContact = (id) =>
    runSql('DELETE FROM contatos WHERE id = ?;', [id]);