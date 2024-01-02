import { AlertTriangleIcon } from "lucide-react";

interface FormErrorsProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorsProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive h-10">
      <AlertTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
