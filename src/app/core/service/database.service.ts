import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: SQLiteObject;
  databaseName: string = 'address.db';

  constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter) { }

  async openDatabase(){
    try {
      this.db = await this.sqlite.create({ name: this.databaseName, location: 'default' });
      await this.createDatabase();
    } catch (error){
      console.error('Creation Database error', error);
    }
  }

  async createDatabase(){
    const sqlCreateDatabase = this.getCreateTable();
    const result = await this.sqlitePorter.importSqlToDb(this.db, sqlCreateDatabase);
    return result ? true : false;
  }

  getCreateTable(){
    const sqls = [];
    sqls.push('CREATE TABLE IF NOT EXISTS address (id integer primary key AUTO_INCREMENT, description varchar(255));');
    return sqls.join('\n');
  }

  executeSQL(sql: string, params?: any[]){
    return this.db.executeSql(sql, params);
  }

}
