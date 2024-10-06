import Modal from "react-modal";

interface EventDetailModalProps {
  isOpen: boolean;
  event: any | null;
  onRequestClose: () => void;
  onDelete: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  onRequestClose,
  onDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed z-50 inset-0 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">イベント詳細</h2>
          {event ? (
            <>
              <div className="mb-4">
                <p className="text-lg font-semibold">タイトル:</p>
                <p className="text-gray-600">{event.title}</p>
              </div>

              <div className="mb-4">
                <p className="text-lg font-semibold">開始時間:</p>
                <p className="text-gray-600">
                  {new Date(event.start).toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-lg font-semibold">終了時間:</p>
                <p className="text-gray-600">
                  {new Date(event.end).toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-lg font-semibold">共有ユーザー:</p>
                {event.sharedWith && event.sharedWith.length > 0 ? (
                  <ul className="ml-6">
                    {event.sharedWith.map((user: any) => (
                      <li key={user._id} className="text-gray-600">
                        {user.name} ({user.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    共有しているユーザーがいません
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  イベントを削除
                </button>
                <button
                  onClick={onRequestClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  閉じる
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">イベントが選択されていません</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;
