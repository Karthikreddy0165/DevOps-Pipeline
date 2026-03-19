type TodoItemProps = {
  id: number;
  title: string;
  onDelete: (id: number) => void;
};

export default function TodoItem({ id, title, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item" data-testid="todo-item">
      <span>{title}</span>
      <button
        onClick={() => onDelete(id)}
        className="delete-btn"
        data-testid="delete-btn"
      >
        Delete
      </button>
    </li>
  );
}
