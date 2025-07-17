export interface FunctionCardProps {
  func: any;
  inputs: Record<string, any>;
  onInputChange: (funcName: string, param: string, value: string) => void;
  expanded: boolean;
  onToggle: (name: string) => void;
}
