"use client";

import type React from "react";
import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CustomInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CustomInputField = forwardRef<HTMLInputElement, CustomInputFieldProps>(
  ({ title, value, onChange, className, ...props }, ref) => {
    const hasValue = value && value.length > 0;
    const showTitle = hasValue;

    return (
      <div className="relative">
        {showTitle && title && (
          <span className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
            {title}
          </span>
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CustomInputField.displayName = "CustomInputField";

export default CustomInputField;
