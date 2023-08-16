const db = require('../db/connection');
const format = require('pg-format');

const readArticlesById = (article_id, next) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {   
        return rows[0];
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = {readArticlesById};