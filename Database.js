import SQLite from "react-native-sqlite-storage";
import { Alert } from "react-native";
import { State } from "react-native-gesture-handler";
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = "vodokanal.db";
const table_name = "credentials";
const database_version = "1.0";
const database_displayname = "Vodokanal credentials";
const database_size = 200000;

export default class Database {
    initDB(){
        let db;
        return new Promise((resolve) => {
            SQLite.echoTest()
                .then(() => {
                    SQLite.openDatabase( database_name, database_version, database_displayname, database_size )
                    .then(DB => {
                        db = DB;
                        db.executeSql('SELECT 1 FROM ' + table_name + ' LIMIT 1').then(() => {
                        }).catch((error) =>{
                            db.transaction((tx) => {
                                //tx.executeSql('DROP TABLE ' + table_name + ' ');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS ' + table_name + ' (username, password)');
                            }).then(() => { console.log("Table created successfully"); }).catch(error => { console.log(error); });
                        });
                        resolve(db);
                    }).catch(error => { console.log(error); });
                }).catch(error => { console.log("Error: plugin not functional"); });
        });
    }

    closeDatabase(db) {
        if (db) { db.close().catch(error => { console(error); }); }
        else{ console.log("Database was not OPENED"); }
    }

    getAllUsers() {
        return new Promise((resolve) => {
            const credentials = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT username, password FROM ' + table_name, []).then(([tx,results]) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            const { username, password } = row;
                            credentials.push({ username, password });
                        }
                        resolve(credentials);
                    });
                }).then((result) => { this.closeDatabase(db); }).catch((err) => { console.log(err) });
            }).catch((err) => { console.log(err) });
        });
    }

    UserByName(name) {
        console.log(name);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM ' + table_name + ' WHERE username = ?', [name]).then(([tx,results]) => {
                        if(results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => { this.closeDatabase(db); }).catch((err) => { console.log(err) });
            }).catch((err) => { console.log(err) });
        });
    }

    addUser(user) {
        return new Promise((resolve, reject) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM ' + table_name + ' WHERE username = ?', [user.username]).then(([tx, results]) => {
                        //если в базе нет пользователя с таким идентификатором - добавить в базу
                        if (!(results.rows.length)){
                            db.transaction((tx) => {
                                tx.executeSql('INSERT INTO ' + table_name + ' VALUES (?, ?)', [user.username, user.password]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            }).then((result) => { this.closeDatabase(db); }).catch((err) => { new Error(err) });
                        }
                        //else { reject(new Error("Даний користувач вже заведений в базу даних")) };
                        }).catch((err) => {new Error(err) });
                    });
            }).catch((err) => { new Error(err) });
        });
    }

    updateUser(user) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE ' + table_name + ' SET username = ?, password = ? WHERE username = ?', [user.username, user.password, user.username]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => { this.closeDatabase(db); }).catch((err) => { console.log(err) });
            }).catch((err) => { console.log(err) });
        });
    }

    deleteUser(user) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM ' + table_name + ' WHERE username = ?', [user]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => { this.closeDatabase(db); }).catch((err) => { console.log(err) });
            }).catch((err) => { console.log(err) });
        });
    }
}
