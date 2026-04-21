import * as React from "react";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "📌","📋","📅","⏰","🔔","🎯","🏷️","📎","🗓️","🧾","📁","💼",
  "🛒","🛍️","💳","💰","💸","🧮","🏦","💎","🎁","📦","🏪","🛍",
  "📱","💻","⌨️","🖥️","🖨️","📷","📺","🎧","🎮","💡","🔌","🔋",
  "🚗","🚙","🚕","🛵","🚲","✈️","🚆","⛽","🛣️","🅿️","🛞","🧰",
  "🏠","🏡","🛋️","🛏️","🚿","🚪","🔑","🪴","🧹","🧴","🧺","🪜",
  "🛡️","🔒","🛟","⚖️","📜","✍️","🖋️","📝","🗂️","🗃️","📊","📈",
  "💉","💊","🩺","🩹","🦷","🧪","🧬","🩻","🏥","🧘","🏃","💪",
  "🍎","🍞","🥗","☕","🍕","🍰","🥤","🧊","🍷","🍺","🥩","🍳",
  "🐶","🐱","🐭","🐰","🦊","🐻","🐼","🐨","🦁","🐮","🐷","🐸",
  "🌳","🌲","🌴","🌵","🌷","🌸","🌻","🌼","🌹","🍀","🍂","❄️",
  "⚽","🏀","🏈","🎾","🏐","⛳","🎿","🏂","🏊","🚴","🥋","🎽",
  "🎵","🎸","🎹","🥁","🎤","🎬","🎨","🎭","📚","🎓","🎒","✏️",
  "⭐","✨","🔥","💥","⚡","☀️","🌙","🌈","💧","🌊","☁️","🌟",
  "✅","❌","❗","❓","🆗","🆕","🔴","🟠","🟡","🟢","🔵","🟣",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔","💕","💞","💖",
];

export function EmojiPicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("h-10 w-full justify-center text-xl", className)}
          aria-label="Pick emoji"
        >
          {value || <Smile className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                onChange(e);
                setOpen(false);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent",
                value === e && "bg-accent ring-2 ring-primary",
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
