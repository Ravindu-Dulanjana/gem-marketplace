"use client";

import { GitCompareArrows } from "lucide-react";
import { useCompare } from "./CompareProvider";

interface CompareButtonProps {
  gemId: string;
}

export default function CompareButton({ gemId }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, isFull } = useCompare();
  const inCompare = isInCompare(gemId);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(gemId);
    } else if (!isFull) {
      addToCompare(gemId);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={!inCompare && isFull}
      className={`p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        inCompare
          ? "text-blue-400 bg-blue-400/10 hover:bg-blue-400/20"
          : "text-muted hover:text-blue-400 hover:bg-blue-400/10"
      }`}
      title={
        inCompare
          ? "Remove from compare"
          : isFull
            ? "Compare is full (max 4)"
            : "Add to compare"
      }
    >
      <GitCompareArrows size={16} />
    </button>
  );
}
