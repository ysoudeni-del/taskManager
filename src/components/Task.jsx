import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Edit2,
  Plus,
  Save,
  Trash2,
  Search,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://taskmanager-1-wp93.onrender.com/api/tasks";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from MongoDB
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = await response.json();

        const formattedTasks = data.map((task) => ({
          id: task._id,
          text: task.title,
          completed: task.completed,
          priority: task.priority || "medium",
          createdAt: new Date(task.createdAt).toLocaleDateString(),
          timestamp: new Date(task.createdAt).getTime(),
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Load Tasks Error:", error);
        alert("Could not load tasks from server");
      } finally {
        setIsLoaded(true);
      }
    };

    fetchTasks();
  }, []);

  // Add Task
  const handleAddTask = async () => {
    const taskText = newTask.trim();

    if (!taskText) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskText,
          description: "",
          priority: "medium",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add task");
      }

      const data = await response.json();

      const newTaskObj = {
        id: data._id,
        text: data.title,
        completed: data.completed,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        priority: data.priority || "medium",
        timestamp: data.createdAt
          ? new Date(data.createdAt).getTime()
          : Date.now(),
      };

      setTasks((prevTasks) => [...prevTasks, newTaskObj]);
      setNewTask("");

      console.log("Task saved successfully:", data);
    } catch (error) {
      console.error("Add Task Error:", error);
      alert(error.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
  };

  // Complete / Uncomplete Task
  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: updatedTask.completed } : t,
        ),
      );

      console.log("Task completion updated:", updatedTask);
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.message);
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.message);
    }
  };

  // Start Editing Task
  const handleEditTask = (index, task) => {
    setEditIndex(index);
    setEditTaskText(task.text);
  };

  // Save Edited Task
  const saveEditTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTaskText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit task");
      }

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, text: updatedTask.title } : task,
        ),
      );

      setEditIndex(null);

      console.log("Task edited successfully:", updatedTask);
    } catch (error) {
      console.error("Edit Error:", error);
      alert(error.message);
    }
  };

  // Update Task Priority
  const updateTaskPriority = async (taskId, priority) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update priority");
      }

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, priority: updatedTask.priority }
            : task,
        ),
      );

      console.log("Priority updated:", updatedTask);
    } catch (error) {
      console.error("Priority Error:", error);
      alert(error.message);
    }
  };

  // Priority Order
  const getPriorityOrder = (priority) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[priority] || 0;
  };

  // Sort Tasks
  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const multiplier = sortDirection === "desc" ? -1 : 1;

      switch (sortCriteria) {
        case "priority":
          return (
            (getPriorityOrder(b.priority) - getPriorityOrder(a.priority)) *
            multiplier
          );

        case "alphabetical":
          return a.text.localeCompare(b.text) * multiplier;

        case "completion":
          return (
            (a.completed === b.completed ? 0 : a.completed ? 1 : -1) *
            multiplier
          );

        default:
          return (b.timestamp - a.timestamp) * multiplier;
      }
    });
  };

  // Filter and Sort Tasks
  const filteredAndSortedTasks = sortTasks(
    tasks.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && !task.completed) ||
        (activeFilter === "completed" && task.completed);

      return matchesSearch && matchesFilter;
    }),
  );

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = tasks.length - completedTasks;
  const totalTasks = tasks.length;

  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Priority Colors
  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-400",
      medium: "text-yellow-400",
      low: "text-blue-400",
    };

    return colors[priority] || "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Total Tasks */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <h3 className="text-3xl font-bold mt-2">{totalTasks}</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Calendar size={26} className="text-purple-400" />
              </div>
            </div>
          </motion.div>

          {/* Completed Tasks */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Completed Tasks</p>
                <h3 className="text-3xl font-bold mt-2">{completedTasks}</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Check size={26} className="text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Pending Tasks</p>
                <h3 className="text-3xl font-bold mt-2">{pendingTasks}</h3>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <Flag size={26} className="text-orange-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Overall Progress
              </h3>
              <p className="text-sm text-gray-400">
                Keep going! You're making progress.
              </p>
            </div>

            <span className="text-2xl font-bold text-purple-400">
              {progressPercentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Task Management Section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6">
          {/* Search and Sort Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-3 flex-col md:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border border-white/10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                  className="bg-black/20 text-white px-4 py-3 rounded-lg outline-none border border-white/10"
                >
                  <option value="date">Date</option>
                  <option value="priority">Priority</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="completion">Completion</option>
                </select>

                <button
                  onClick={() =>
                    setSortDirection((prev) =>
                      prev === "asc" ? "desc" : "asc",
                    )
                  }
                  className="px-4 bg-black/20 rounded-lg border border-white/10"
                  title="Revert"
                >
                  {sortDirection === "asc" ? "A - Z" : "Z - A"}
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: "all", label: "All Tasks", count: tasks.length },
                { id: "active", label: "Active", count: pendingTasks },
                {
                  id: "completed",
                  label: "Completed",
                  count: completedTasks,
                },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "bg-black/20 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 opacity-70">({filter.count})</span>
                </button>
              ))}
            </div>

            {/* Add Task Input */}
            <div className="flex gap-3 flex-col md:flex-row">
              <input
                type="text"
                className="flex-1 bg-black/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border border-white/10"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <button
                type="button"
                onClick={handleAddTask}
                className="relative z-50 cursor-pointer py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-450px)]"
          >
            <AnimatePresence>
              {filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="group transform transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`backdrop-blur-xl rounded-xl border-t-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      task.completed
                        ? "bg-green-500/10 border-green-500/50 hover:shadow-green-500/10"
                        : "bg-white/10 border-purple-500/50 hover:shadow-purple-500/10"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4 mb-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            task.completed
                              ? "bg-green-500/80 border-green-400"
                              : "border-white/30 hover:border-purple-400"
                          }`}
                        >
                          {task.completed && <Check size={12} />}
                        </button>

                        <div className="flex-1 min-w-0 overflow-hidden">
                          {editIndex === index ? (
                            <input
                              type="text"
                              className="w-full bg-black/20 text-white p-2 rounded-lg outline-none border border-white/20"
                              value={editTaskText}
                              onChange={(e) => setEditTaskText(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && saveEditTask(task.id)
                              }
                            />
                          ) : (
                            <div>
                              <div className="flex items-center gap-2">
                                <p
                                  className={`text-sm ${
                                    task.completed
                                      ? "line-through text-gray-400"
                                      : "text-white"
                                  }`}
                                >
                                  {task.text}
                                </p>

                                <Flag
                                  size={14}
                                  className={getPriorityColor(task.priority)}
                                />
                              </div>

                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                <Calendar size={12} />
                                <span>{task.createdAt}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-2 pt-2 border-t border-white/10">
                        <select
                          value={task.priority}
                          onChange={(e) =>
                            updateTaskPriority(task.id, e.target.value)
                          }
                          className="bg-black/20 text-white text-sm px-2 py-1 rounded outline-none border border-white/10"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>

                        <div className="flex gap-2">
                          {editIndex === index ? (
                            <button
                              onClick={() => saveEditTask(task.id)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
                            >
                              <Save size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditTask(index, task)}
                              className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredAndSortedTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white">No tasks found</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
