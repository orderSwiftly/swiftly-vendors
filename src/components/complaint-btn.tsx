import { Headphones } from "lucide-react";

interface ComplaintButtonProps {
  readonly onClick: () => void;
}

export default function ComplaintButton({ onClick }: ComplaintButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-(--acc-clr) text-[bg-clr] sec-ff font-semibold px-4 py-3 rounded-full cursor-pointer flex items-center shadow-md hover:bg-opacity-90 hover:shadow-lg transition"
    >
      <Headphones className="mr-2" size={20} />
      <span>Support</span>
    </button>
  );
}