import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { MessageCircle, Users2 } from "lucide-react";
import { FC } from "react";

interface MobileActionProps {}

const MobileActions: FC<MobileActionProps> = ({}) => {
  return (
    <div className="bg-card text-card-foreground flex w-full items-center justify-center gap-2.5 border py-1.5 shadow-sm">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" variant="ghost">
            <MessageCircle />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Lol</DrawerHeader>
          {/* <Chat /> */}
          <p>Hello</p>
        </DrawerContent>
      </Drawer>

      <Button size="icon" variant="ghost">
        <Users2 />
      </Button>
    </div>
  );
};

export default MobileActions;
