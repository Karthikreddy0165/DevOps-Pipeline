import { db } from '../../lib/db';

describe('Todos Database — Unit', () => {
  it('should create the todos table', () => {
    const table = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'")
      .get();
    expect(table).toBeDefined();
  });

  it('should insert and retrieve a todo', () => {
    const result = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Unit test task');
    expect(result.lastInsertRowid).toBeTruthy();

    const todo = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(result.lastInsertRowid) as any;
    expect(todo.title).toBe('Unit test task');
    expect(todo.done).toBe(0);
  });

  it('should mark a todo as done', () => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Task to complete');

    db.prepare('UPDATE todos SET done = 1 WHERE id = ?').run(lastInsertRowid);

    const todo = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid) as any;
    expect(todo.done).toBe(1);
  });

  it('should delete a todo', () => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Task to delete');

    db.prepare('DELETE FROM todos WHERE id = ?').run(lastInsertRowid);

    const todo = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid);
    expect(todo).toBeUndefined();
  });
});
