import { db } from '../../lib/db';

describe('Todos API Integration — DB layer', () => {
  it('should return an array from the todos table', () => {
    const todos = db.prepare('SELECT * FROM todos').all();
    expect(Array.isArray(todos)).toBe(true);
  });

  it('should correctly insert and then read back a todo', () => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Integration test todo');

    const todo = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid) as any;

    expect(todo).toBeDefined();
    expect(todo.title).toBe('Integration test todo');
    expect(todo.done).toBe(0);
  });

  it('should toggle a todo done status and persist it', () => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Toggle test');

    db.prepare('UPDATE todos SET done = 1 WHERE id = ?').run(lastInsertRowid);
    const updated = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid) as any;
    expect(updated.done).toBe(1);

    db.prepare('UPDATE todos SET done = 0 WHERE id = ?').run(lastInsertRowid);
    const reverted = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid) as any;
    expect(reverted.done).toBe(0);
  });

  it('should delete a todo and confirm it no longer exists', () => {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run('Delete me');

    db.prepare('DELETE FROM todos WHERE id = ?').run(lastInsertRowid);
    const gone = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(lastInsertRowid);
    expect(gone).toBeUndefined();
  });
});
