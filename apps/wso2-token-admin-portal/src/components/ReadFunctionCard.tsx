import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { readContract } from "@wagmi/core";
import { ABI } from "@/data/abi";
import { config } from "@/configs/wagmi";
import { toast } from "sonner";
import type { FunctionCardProps } from "@/types";
import { contractAddress } from "@/data/chain-config";

const ReadFunctionCard: React.FC<FunctionCardProps> = (props) => {
  const { func, inputs, onInputChange, expanded, onToggle } = props;
  const [queryLoading, setQueryLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleQuery = async () => {
    setQueryLoading(true);
    try {
      const result = await readContract(config, {
        address: contractAddress,
        abi: ABI,
        functionName: func.name,
        args: func.inputs.map((input: any) => inputs[func.name]?.[input.name]),
      });

      setResult(result);
      toast.success(`Successfully queried contract: ${result}`);
    } catch (error) {
      console.error("Error querying contract:", error);
      toast.error("Error querying contract");
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#ff7300]/30 dark:hover:border-[#ff7300]/30">
      <button
        onClick={() => onToggle(func.name)}
        className="w-full flex items-center justify-between p-4 text-left text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-color"
      >
        <span className="font-mono text-xs">{func.name}</span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform duration-200 ${
            expanded ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {expanded && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
            {func.inputs.length > 0 && (
              <div className="grid gap-2">
                {func.inputs.map((input: any, idx: number) => (
                  <Input
                    key={idx}
                    type="text"
                    placeholder={input.name || input.type}
                    value={inputs[func.name]?.[input.name] || ""}
                    onChange={(e) =>
                      onInputChange(func.name, input.name, e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:border-[#ff7300] focus:ring-[#ff7300] focus:outline-none transition-colors focus-visible:ring-0 md:text-xs"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center justify-start gap-2">
              <Button
                className="bg-[#ff7300] text-white rounded-lg text-xs cursor-pointer w-[100px]"
                size={"sm"}
                onClick={handleQuery}
                disabled={queryLoading}
              >
                Query{" "}
                {queryLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  ""
                )}
              </Button>
              {result && (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {` Result: ${result}`}
                </div>
              )}

              {result === false && (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Result: {"false"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadFunctionCard;
