import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NoChatSelected() {
  return (
    <div className="relative flex h-full items-center justify-center bg-gray-50">
      {/* SIDEBAR TOGGLE (TOP-LEFT) */}
      <div className="absolute top-4 left-4">
        <SidebarTrigger />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center text-center max-w-sm px-6">
        {/* ICON */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8m-8 4h5m-9 6h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* TEXT */}
        <h2 className="text-lg font-semibold text-gray-900">
          No chat selected
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}
