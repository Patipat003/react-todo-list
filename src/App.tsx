import { useState, useEffect } from "react"
import { RiAddCircleLine, RiEditCircleLine, RiCloseCircleLine, RiCircleLine  } from "react-icons/ri";
import { BiMicrochip } from "react-icons/bi";

type Task = {
  text: string;
  done: boolean;
};

const App = () => {
  const [text, setText] = useState<string>("");
  const [task, setTask] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");


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

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(task[index].text);
  };

  const saveEdit = (index: number) => {
    if (editText.trim() === "") return;
    const updated = task.map((t, i) =>
      i === index ? { ...t, text: editText } : t
    );
    setTask(updated);
    setEditingIndex(null);
    setEditText("");
  };

  
  return (
    <div className="min-h-screen bg-linear-0 from-black to-red-900/50 bg-black">
      <div className="pt-4">
        <h1 className="text-xl font-bold mb-4 text-red-500 text-center flex items-center justify-center space-x-2 ">
          <BiMicrochip className="text-2xl" />
          <span>Todo List</span>
        </h1>

        
        <div className="my-4 h-0.5 border-t-0 bg-red-900 mx-6"></div>
      </div>
        
      <div className="p-4 max-w-md mx-auto">
        <div className="flex mb-4">
          <input 
            className="border pl-4 py-2 flex-grow mr-2 text-cyan-300 rounded ring-2 ring-cyan-300/50 focus:outline-2 focus:outline-cyan-300" 
            onChange={addText} 
            value={text} 
            placeholder="Add a task" 
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            autoFocus
          />
          <button 
            className="flex items-center px-4 text-cyan-300 font-semibold border-1 ring-2 ring-cyan-300/50 hover:bg-red-900 border-cyan-300 rounded hover:outline-1 hover:scale-95 transition-transform duration-100 cursor-pointer" 
            type="button"
            title="Add"
            onClick={addTask}
          >
            <RiAddCircleLine /><span className="ml-1">ADD</span>
          </button>
        </div>
        
        {/* ส่วนแสดง Task List */}
        <div>
          <ul className="space-y-2">
            {task.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded border-1 border-red-500 text-cyan-300">
                <label className="space-x-4 w-full flex items-center">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(index)}
                    className="w-5 h-5 rounded appearance-none checked:bg-yellow-300 checked:border-yellow-300 border-2 border-cyan-400 focus:outline-none cursor-pointer"
                  />
                  {editingIndex === index ? (
                    <input
                      className="border-0 border-b border-cyan-300 bg-transparent p-1 w-full text-cyan-300 focus:outline-none focus:border-b-2 focus:border-cyan-300"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(index)}
                      onBlur={() => saveEdit(index)}
                      autoFocus
                    />
                  ) : (
                    <span className={item.done ? "line-through" : ""}> {item.text} </span>
                  )}
                </label>
                <div className="grid grid-cols-2 ml-2 space-x-4">
                  {editingIndex === index ? (
                    <button type="button" title="Save" className="text-red-500 text-xl hover:text-yellow-200 cursor-pointer" onClick={() => saveEdit(index)}><RiCircleLine /></button>
                  ) : (
                    <button type="button" title="Edit" className="text-red-500 text-xl hover:text-yellow-200 cursor-pointer" onClick={() => startEdit(index)}>
                      <RiEditCircleLine />
                    </button>
                  )}
                  <button type="button" title="Delete" className="text-red-500 text-xl hover:text-yellow-200 cursor-pointer" onClick={() => delTask(index)}>
                      <RiCloseCircleLine />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>   
  )
}

export default App