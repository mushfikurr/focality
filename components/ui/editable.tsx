"use client";

import { useState, useRef, useEffect } from "react";

import * as React from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useFormContext,
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type Control,
} from "react-hook-form";

// Fix the interface by using Omit to exclude the native onChange
interface EditableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  confirmOnClickOutside?: boolean;
}

const Editable = React.forwardRef<HTMLDivElement, EditableProps>(
  (
    {
      className,
      defaultValue = "",
      value,
      onChange,
      onConfirm,
      onCancel,
      placeholder,
      disabled = false,
      isEditing: isEditingProp,
      onEditingChange,
      confirmOnClickOutside = true,
      ...props
    },
    ref,
  ) => {
    const [internalIsEditing, setInternalIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value || defaultValue);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Combine the external ref with our internal ref
    const setRefs = (element: HTMLDivElement | null) => {
      // Update the internal ref
      if (wrapperRef) {
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current =
          element;
      }

      // Forward the ref
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Determine if component is in controlled or uncontrolled mode
    const isControlled = isEditingProp !== undefined;
    const isEditing = isControlled ? isEditingProp : internalIsEditing;

    // Update internal state and call onEditingChange when editing state changes
    const setIsEditing = (editing: boolean) => {
      if (!isControlled) {
        setInternalIsEditing(editing);
      }
      onEditingChange?.(editing);
    };

    // Sync with external value
    React.useEffect(() => {
      if (value !== undefined && value !== inputValue) {
        setInputValue(value);
      }
    }, [value]);

    // Focus input when entering edit mode
    React.useEffect(() => {
      if (isEditing) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 0);
      }
    }, [isEditing]);

    // Handle click outside
    useEffect(() => {
      if (!isEditing || !confirmOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          handleConfirm();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isEditing, confirmOnClickOutside]);

    const handleEdit = () => {
      if (disabled) return;
      setIsEditing(true);
    };

    const handleConfirm = () => {
      setIsEditing(false);
      onChange?.(inputValue);
      onConfirm?.(inputValue);
    };

    const handleCancel = () => {
      setIsEditing(false);
      setInputValue(value || defaultValue);
      onCancel?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          "relative flex w-full items-center",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {isEditing ? (
          <div className="flex w-full items-center">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="h-6 w-full px-1 pr-16"
              disabled={disabled}
            />
            <div className="absolute right-1 flex">
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-full border-r-0"
                onClick={handleConfirm}
                disabled={disabled}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hover:bg-destructive h-full"
                onClick={handleCancel}
                disabled={disabled}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleEdit}
            className={cn(
              "flex w-full cursor-pointer items-center py-1 text-sm",
              !inputValue && "text-muted-foreground italic",
              "hover:bg-secondary/20 rounded px-1 transition-colors",
            )}
          >
            {inputValue || placeholder || "Click to edit"}
          </div>
        )}
      </div>
    );
  },
);
Editable.displayName = "Editable";

export interface EditableFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<EditableProps, "defaultValue" | "value" | "onChange"> {
  control?: Control<TFieldValues>;
  name: TName;
  defaultValue?: string;
  rules?: ControllerProps<TFieldValues, TName>["rules"];
}

function EditableField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue = "",
  rules,
  ...props
}: EditableFieldProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();

  // Fix: Don't try to create a complete ControllerProps object
  // Instead, pass the individual props directly to Controller
  return (
    <Controller
      name={name}
      control={control ?? formContext?.control}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field }) => (
        <Editable
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

export { Editable, EditableField };
