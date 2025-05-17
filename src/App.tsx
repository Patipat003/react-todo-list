import { useState, useEffect } from "react"

type Task = {
  text: string;
  done: boolean;
};

const App = () => {
  const [text, setText] = useState<string>("");
  const [task, setTask] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const savedTask = localStorage.getItem("tasks");
    if (savedTask) {
      try {
        setTask(JSON.parse(savedTask));
      } catch (err) {
        console.error(err);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(task));
    }
  }, [task, isLoaded]);

  const addText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const addTask = () => {
    if (text.trim() !== "") {
      setTask([...task, { text: text, done: false }]);
      setText("");
    }
  }

  const delTask = (index: number) => {
    setTask(task.filter((_, i) => i !== index));
  }

  const toggleDone = (index: number) => {
    const updateTask = task.map((task, i) => {
      // ternary operator เงื่อนไข ? ค่าถ้าจริง : ค่าถ้าเท็จ
      return i === index ? {...task, done: !task.done} : task
    })
    setTask(updateTask);
  }
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input 
          className="border p-2 flex-grow mr-2" 
          onChange={addText} 
          value={text} 
          placeholder="Add a task" 
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          type="button" 
          onClick={addTask}
        >
          ADD
        </button>
      </div>
      <div>
        <ul className="space-y-2">
          {task.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <label className="space-x-4 w-full">
                <input type="checkbox" placeholder="x" checked={item.done} onChange={() => toggleDone(index)}></input>
                <span>{item.text}</span>
              </label>
              <button 
                className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer" 
                type="button" 
                onClick={() => delTask(index)}
              >
                DEL
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App