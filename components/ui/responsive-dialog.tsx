"use client";
import { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogProps, DialogTitleProps, DialogTriggerProps } from "@radix-ui/react-dialog";
import { HTMLAttributes, createContext, useContext } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import {
  Dialog as DialogComponent,
  DialogContent as Content,
  DialogDescription as Description,
  DialogHeader as Header,
  DialogTitle as Title,
  DialogTrigger as Trigger,
  DialogClose as Close,
  DialogFooter as Footer,
} from "../../components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./button";
import { useDesktop } from "../../lib/hooks";

const DialogContext = createContext(false);

export function Dialog({ ...props }: DialogProps){
  const desktop = useDesktop();
  return (
    <DialogContext.Provider value={desktop}>
      {desktop ? <DialogComponent {...props} /> : <Drawer {...props} />}
    </DialogContext.Provider>
  )
}

export function DialogContent(props: DialogContentProps & { onAnimationEnd?: (open: boolean) => void } & HTMLAttributes<HTMLDivElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Content {...props} /> : <DrawerContent {...props} />;
}

export function DialogHeader(props: HTMLAttributes<HTMLDivElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Header {...props} /> : <DrawerHeader {...props} />;
}

export function DialogFooter(props: HTMLAttributes<HTMLDivElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Footer {...props} /> : <DrawerFooter {...props} />;
}

export function DialogTitle(props: DialogTitleProps & HTMLAttributes<HTMLHeadingElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Title {...props} /> : <DrawerTitle {...props} />;
}

export function DialogDescription(props: DialogDescriptionProps & HTMLAttributes<HTMLParagraphElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Description {...props} /> : <DrawerDescription {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps & HTMLAttributes<HTMLButtonElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Trigger {...props} /> : <DrawerTrigger {...props} />;
}

export function DialogClose(props: DialogCloseProps & HTMLAttributes<HTMLButtonElement>){
  const isDialog = useContext(DialogContext);
  return isDialog ? <Close {...props} /> : <DrawerClose {...props} />;
}

export function AlertDialog({ children, onClick }: { children: React.ReactNode, onClick: () => any }){
  return (
    <Dialog>
      <DialogTrigger>
        <FontAwesomeIcon icon={faTrash} className="ml-2 h-4 hover:text-red-500 transition cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            {children}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose onClick={onClick} asChild>
            <Button>Continue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}