
import { useState } from "react";
import { getFunctionsByType } from "@/lib/utils";
import ReadFunctionCard from "@/components/ReadFunctionCard";
import WriteFunctionCard from "@/components/WriteFunctionCard";
import Header from "./components/Header";

function App() {
  const [activeTab, setActiveTab] = useState<"read" | "write">("read");
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const { read, write } = getFunctionsByType();
  const functions = { read, write };

  const handleInputChange = (
    funcName: string,
    param: string,
    value: string
  ) => {
    setInputs((prev) => ({
      ...prev,
      [funcName]: { ...prev[funcName], [param]: value },
    }));
  };

  const toggleFunction = (name: string) => {
    if (expandedFunction === name) {
      setExpandedFunction(null);
    } else {
      setExpandedFunction(name);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header />

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("read")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "read"
                  ? "text-[#ff7300] border-b-2 border-[#ff7300]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Read Functions
            </button>
            <button
              onClick={() => setActiveTab("write")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "write"
                  ? "text-[#ff7300] border-b-2 border-[#ff7300]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Write Functions
            </button>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === "read"
              ? functions.read.map((func) => (
                  <ReadFunctionCard
                    key={func.name}
                    func={func}
                    inputs={inputs}
                    onInputChange={handleInputChange}
                    expanded={expandedFunction === func.name}
                    onToggle={toggleFunction}
                  />
                ))
              : functions.write.map((func) => (
                  <WriteFunctionCard
                    key={func.name}
                    func={func}
                    inputs={inputs}
                    onInputChange={handleInputChange}
                    expanded={expandedFunction === func.name}
                    onToggle={toggleFunction}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
