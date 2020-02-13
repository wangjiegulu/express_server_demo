module.exports = {
    
    // mysql config
    mysql: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin123",
        database: "moca_db",
        synchronize: true,
        logging: true,
        extra: {
            connectionLimit: 5, // core number  * 2 + n
        },    
    },

    server: {
        port: 8731
    }
    
}