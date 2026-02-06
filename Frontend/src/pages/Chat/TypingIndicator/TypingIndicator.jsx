export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 mx-3 my-2 bg-gray-200 rounded-xl w-fit">
      <span className="sr-only">Typing...</span>

      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" />
    </div>
  );
}
