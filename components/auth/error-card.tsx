import { AlertTriangleIcon } from "lucide-react";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLable="Opps something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center text-destructive">
        <AlertTriangleIcon className="h-4 w-4" />
      </div>
    </CardWrapper>
  );
};
