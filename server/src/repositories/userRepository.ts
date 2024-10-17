import {pool} from '../config/dbConfig';

export const findUserByEmail = async (email : string) =>{
    return pool.query('SELECT * FROM users WHERE email = $1', [email]);
};

export const createUser = async (id: string, email: string, displayName: string, username: string, hashedPassword: string) => {
    return pool.query(
        'INSERT INTO users (id, email, display_name, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [id, email, displayName, username, hashedPassword]
    );
};