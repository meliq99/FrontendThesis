import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
}; 