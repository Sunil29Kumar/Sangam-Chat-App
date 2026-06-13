import { IoMdClose } from "react-icons/io";

function ReplyPreview({
  isReplyContainerOpen,
  replyingData,
  scrollToReplayedMessage,
  setIsReplyContainerOpen,
  setReplyingData,
}: {
  isReplyContainerOpen: boolean;
  replyingData: any;
  scrollToReplayedMessage: (messageId: string) => void;
  setIsReplyContainerOpen: (isOpen: boolean) => void;
  setReplyingData: (data: any) => void;
}) {
  return (
    <div>
      {isReplyContainerOpen && (
        <div className=" flex justify-between px-3 py-2 bg-gray-100 rounded-md ">
          <p>
            <span>{replyingData?.messageSender?.name || "You"}</span>
            <h3
              onClick={() =>
                scrollToReplayedMessage(replyingData.replyToMessageId)
              }
              className=" cursor-pointer bg-blue-100 w-full p-2 rounded-md  "
            >
              {replyingData?.replyToMessageText.length > 50
                ? replyingData?.replyToMessageText.substring(0, 50) + "..."
                : replyingData?.replyToMessageText}
            </h3>
          </p>
          <IoMdClose
            onClick={() => {
              setIsReplyContainerOpen(false);
              setReplyingData({
                messageSender: {},
                replyToMessageId: "",
                replyToMessageText: "",
                conversationId: "",
              });
            }}
            className=" cursor-pointer "
          />
        </div>
      )}
    </div>
  );
}

export default ReplyPreview;
