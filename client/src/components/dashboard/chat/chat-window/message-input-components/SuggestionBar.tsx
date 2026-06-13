import {ClosedCaption} from "lucide-react";

function SuggestionBar({
  suggestedMessageData,
  editedMessage,
  setText,
  text,
  setSuggestedMessageData,
  setEditedMessage,
}: {
  suggestedMessageData: string[];
  editedMessage: any;
  text: string;
  setText: any;
  setSuggestedMessageData: any;
  setEditedMessage: any;
}) {
  console.log("isrecording",);

  return (
    <div>
      {suggestedMessageData.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50/70 via-slate-50/50 to-indigo-50/70 border-b border-slate-100/80 -mx-3 -mt-2 mb-1 animate-fadeIn">
          {/* Left Icon with subtle glow */}
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100/80 text-indigo-600 shrink-0 shadow-sm animate-pulse">
            <ClosedCaption size={14} className="stroke-[2.5]" />
          </div>

          {/* Horizontal Scrollable Chips Box */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5">
            {suggestedMessageData.map((suggestion, index) => (
              <button
                key={index}
                onClick={(e) => {
                  const currentText = editedMessage.messageId
                    ? editedMessage.content
                    : text;
                  const words = currentText.trim().split(" ");
                  const lastWord = words[words.length - 1] || "";

                  // Core replacement mechanism
                  const newText =
                    currentText.trim().slice(0, -lastWord.length) +
                    suggestion +
                    " ";

                  if (editedMessage.messageId) {
                    setEditedMessage({...editedMessage, content: newText});
                  } else {
                    setText(newText);
                  }
                  setSuggestedMessageData([]);
                }}
                className="bg-white hover:bg-indigo-600 border border-slate-200/80 hover:border-indigo-600 text-slate-700 hover:text-white font-medium text-xs px-3 py-1 rounded-full shadow-sm active:scale-95 transition-all duration-200 whitespace-nowrap tracking-wide"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestionBar;
