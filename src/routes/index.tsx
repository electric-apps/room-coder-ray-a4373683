import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { todosCollection } from "@/db/collections/todos";
import { useState } from "react";
import {
	AlertDialog,
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Select,
	Separator,
	SegmentedControl,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	component: HomePage,
});

type Filter = "all" | "active" | "completed";
type Priority = "low" | "medium" | "high";

const PRIORITY_COLORS: Record<Priority, "gray" | "orange" | "red"> = {
	low: "gray",
	medium: "orange",
	high: "red",
};

function HomePage() {
	const [filter, setFilter] = useState<Filter>("all");
	const [addOpen, setAddOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);

	const { data: todos, isLoading } = useLiveQuery((q) =>
		q
			.from({ todos: todosCollection })
			.orderBy(({ todos }) => todos.completed, "asc")
			.orderBy(({ todos }) => todos.created_at, "desc"),
	);

	const filteredTodos = todos?.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	const handleToggle = (todo: Todo) => {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
		});
	};

	const handleDelete = (todo: Todo) => {
		todosCollection.delete(todo.id);
		setDeleteTarget(null);
	};

	const activeCount = todos?.filter((t) => !t.completed).length ?? 0;

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">My Todos</Heading>
						<Text size="2" color="gray">
							{activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
						</Text>
					</Flex>
					<Button onClick={() => setAddOpen(true)}>
						<Plus size={16} /> Add Todo
					</Button>
				</Flex>

				<SegmentedControl.Root
					value={filter}
					onValueChange={(v) => setFilter(v as Filter)}
					size="2"
				>
					<SegmentedControl.Item value="all">All</SegmentedControl.Item>
					<SegmentedControl.Item value="active">Active</SegmentedControl.Item>
					<SegmentedControl.Item value="completed">
						Completed
					</SegmentedControl.Item>
				</SegmentedControl.Root>

				{isLoading ? (
					<Flex align="center" justify="center" py="9">
						<Spinner size="3" />
					</Flex>
				) : filteredTodos && filteredTodos.length > 0 ? (
					<Flex direction="column" gap="2">
						{filteredTodos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onToggle={handleToggle}
								onDelete={setDeleteTarget}
							/>
						))}
					</Flex>
				) : (
					<Flex direction="column" align="center" gap="3" py="9">
						<ClipboardList size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "completed"
								? "No completed todos yet"
								: filter === "active"
									? "All caught up!"
									: "No todos yet"}
						</Text>
						{filter !== "completed" && (
							<Button variant="soft" onClick={() => setAddOpen(true)}>
								Add your first todo
							</Button>
						)}
					</Flex>
				)}

				{todos && todos.length > 0 && (
					<>
						<Separator size="4" />
						<Text size="2" color="gray">
							{todos.filter((t) => t.completed).length} of {todos.length}{" "}
							completed
						</Text>
					</>
				)}
			</Flex>

			<AddTodoDialog open={addOpen} onOpenChange={setAddOpen} />

			<AlertDialog.Root
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
			>
				<AlertDialog.Content maxWidth="400px">
					<AlertDialog.Title>Delete Todo</AlertDialog.Title>
					<AlertDialog.Description size="2">
						Are you sure you want to delete "{deleteTarget?.title}"? This cannot
						be undone.
					</AlertDialog.Description>
					<Flex gap="3" justify="end" mt="4">
						<AlertDialog.Cancel>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action>
							<Button
								color="red"
								onClick={() => deleteTarget && handleDelete(deleteTarget)}
							>
								Delete
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Container>
	);
}

function TodoItem({
	todo,
	onToggle,
	onDelete,
}: {
	todo: Todo;
	onToggle: (t: Todo) => void;
	onDelete: (t: Todo) => void;
}) {
	const priority = (todo.priority ?? "medium") as Priority;

	return (
		<Card>
			<Flex align="center" gap="3">
				<Checkbox
					checked={todo.completed}
					onCheckedChange={() => onToggle(todo)}
					size="2"
				/>
				<Flex direction="column" gap="1" flexGrow="1">
					<Text
						weight="medium"
						style={{
							textDecoration: todo.completed ? "line-through" : undefined,
							opacity: todo.completed ? 0.5 : 1,
						}}
					>
						{todo.title}
					</Text>
					{todo.notes && (
						<Text size="2" color="gray">
							{todo.notes}
						</Text>
					)}
				</Flex>
				<Flex align="center" gap="2">
					<Badge color={PRIORITY_COLORS[priority]} variant="soft" size="1">
						{priority}
					</Badge>
					{todo.due_date && (
						<Text size="1" color="gray">
							{new Date(todo.due_date).toLocaleDateString()}
						</Text>
					)}
					<IconButton
						size="1"
						variant="ghost"
						color="red"
						onClick={() => onDelete(todo)}
					>
						<Trash2 size={14} />
					</IconButton>
				</Flex>
			</Flex>
		</Card>
	);
}

function AddTodoDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [priority, setPriority] = useState<Priority>("medium");
	const [dueDate, setDueDate] = useState("");
	const handleSubmit = () => {
		if (!title.trim()) return;

		todosCollection.insert({
			id: crypto.randomUUID(),
			title: title.trim(),
			notes: notes.trim() || null,
			completed: false,
			priority,
			due_date: dueDate ? new Date(dueDate) : null,
			created_at: new Date(),
			updated_at: new Date(),
		});

		setTitle("");
		setNotes("");
		setPriority("medium");
		setDueDate("");
		onOpenChange(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content maxWidth="450px">
				<Dialog.Title>New Todo</Dialog.Title>
				<Flex direction="column" gap="4" mt="4">
					<label>
						<Text size="2" weight="medium" as="div" mb="1">
							Title *
						</Text>
						<TextField.Root
							placeholder="What needs to be done?"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
							autoFocus
						/>
					</label>
					<label>
						<Text size="2" weight="medium" as="div" mb="1">
							Notes
						</Text>
						<TextField.Root
							placeholder="Optional notes..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</label>
					<Flex gap="3">
						<Flex direction="column" gap="1" flexGrow="1">
							<Text size="2" weight="medium">
								Priority
							</Text>
							<Select.Root
								value={priority}
								onValueChange={(v) => setPriority(v as Priority)}
							>
								<Select.Trigger />
								<Select.Content>
									<Select.Item value="low">Low</Select.Item>
									<Select.Item value="medium">Medium</Select.Item>
									<Select.Item value="high">High</Select.Item>
								</Select.Content>
							</Select.Root>
						</Flex>
						<Flex direction="column" gap="1" flexGrow="1">
							<Text size="2" weight="medium">
								Due date
							</Text>
							<TextField.Root
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
							/>
						</Flex>
					</Flex>
					<Flex gap="3" justify="end" mt="2">
						<Dialog.Close>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
						<Button onClick={handleSubmit} disabled={!title.trim()}>
							Add Todo
						</Button>
					</Flex>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
}
