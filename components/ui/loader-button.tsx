import { useRef, useState } from "react";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";

interface Props extends ButtonProps {
  onClick: () => Promise<void>;
  loadingText: string;
}

export default function LoaderButton({ onClick, loadingText, children, ...props } : Props){
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  async function wrapped(){
    setLoading(true);
    await onClick();
    setLoading(false);
  }
  return (
    <Button {...props} onClick={wrapped} ref={ref} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">{loadingText}</span>
        </>
      ) : children}
    </Button>
  );
}