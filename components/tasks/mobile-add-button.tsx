import { CoffeeIcon, Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function MobileAddButton({ actions }: { actions: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex md:hidden" asChild>
        <Button variant="outline" className="size-8" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={actions.addTask}>
            <Plus /> Add Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={actions.addBreak}>
            <CoffeeIcon /> Add Break
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
