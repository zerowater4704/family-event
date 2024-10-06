import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  createEvent,
  deleteEvent,
  getEventByUser,
  getSharedUsers,
} from "../../services/eventService";
import Modal from "react-modal";
import EventDetailModal from "./EventDetailModal";

// Moment.jsを使用してローカライザーを設定
const localizer = momentLocalizer(moment);

interface MyCalendarProps {
  title: string;
  start: Date;
  end: Date;
  date?: string;
}

const MyCalendar = () => {
  const [events, setEvents] = useState<MyCalendarProps[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [startTime, setStartTime] = useState(""); // 開始時間の入力
  const [finishTime, setFinishTime] = useState(""); // 終了時間の入力
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]); // 共有ユーザーリスト
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // 選択したユーザーIDのリスト

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventByUser();

        // responseは配列なので直接mapを使用
        if (response && Array.isArray(response)) {
          const fetchedEvents = response.map((event: any) => ({
            title: event.title,
            start: new Date(`${event.date.split("T")[0]}T${event.startTime}`), // 日付と開始時間を組み合わせて start を生成
            end: new Date(`${event.date.split("T")[0]}T${event.finishTime}`), // 日付と終了時間を組み合わせて end を生成
            _id: event._id,
            sharedWith: event.sharedWith,
          }));
          console.log(response);
          setEvents(fetchedEvents);
        } else {
          console.log("イベント取得に失敗しました");
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchSharedUsers = async () => {
      try {
        const response = await getSharedUsers();
        if (!response.type) {
          setSharedUsers(response);
        } else {
          console.error("ユーザー取得エラー", response.message);
        }
      } catch (error) {
        console.log("共有ユーザーを取得エラー", error);
      }
    };
    fetchSharedUsers();
  }, []);

  const handleCreateEvent = async () => {
    if (!newEventTitle) {
      setErrors(["タイトルを入力してください"]);
      return;
    }

    const newEvent = {
      title: newEventTitle,
      date: moment().tz("Asia/Tokyo").toDate(), // イベントの日付 (本日の日付を使用)
      startTime: startTime, // 手動で入力された開始時間
      finishTime: finishTime, // 手動で入力された終了時間
      sharedWith: selectedUsers, // 共有ユーザーリスト
    };

    const result = await createEvent(newEvent);
    if (!result.type) {
      const newEventToAdd: MyCalendarProps = {
        title: result.savedEvent.title,
        start: new Date(result.savedEvent.date),
        end: new Date(result.savedEvent.date),
      };
      if (Array.isArray(events)) {
        setEvents([...events, newEventToAdd]);
      } else {
        setEvents([newEventToAdd]); // 配列でない場合、新しい配列にして追加
      }

      setIsModalOpen(false);
      window.location.reload();
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const result = await deleteEvent(selectedEvent._id);
      if (!result.type) {
        const updatedEvents = events.filter(
          (event) => event !== selectedEvent._id
        );
        setEvents(updatedEvents); // ステートを更新してカレンダーに反映
        setSelectedEvent(null);
        setIsDetailModalOpen(false);
        window.location.reload();
      } else {
        console.log("イベント削除に失敗しました");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-4">
        {/* カレンダーのスタイル */}
        <div className="w-full max-w-4xl">
          <div className="shadow-lg border rounded-lg bg-white p-6">
            <div style={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                step={30} // 30分刻みのスロット
                timeslots={2} // 各スロットの間隔（30分刻み）
                onSelectSlot={(slotInfo) => {
                  console.log("slotInfo start:", slotInfo.start);
                  console.log("slotInfo end:", slotInfo.end);

                  setSelectedSlot(slotInfo);
                  setStartTime(
                    moment(slotInfo.start).tz("Asia/Tokyo").format("HH:mm")
                  ); // スロットの開始時間を初期値に
                  setFinishTime(
                    moment(slotInfo.end).tz("Asia/Tokyo").format("HH:mm")
                  );
                  setIsModalOpen(true);
                }}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setIsDetailModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* モーダルのスタイル */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="fixed z-50 inset-0 overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">新しいイベント作成</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  イベントタイトル
                </label>
                <input
                  type="text"
                  placeholder="イベントタイトル"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  開始時間
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  終了時間
                </label>
                <input
                  type="time"
                  value={finishTime}
                  onChange={(e) => setFinishTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-gray-700 font-semibold mb-2">
                  共有したいユーザーを選択してください
                </h3>
                {sharedUsers.map((user) => (
                  <div key={user._id} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value={user._id}
                        onChange={(e) => {
                          const selected = [...selectedUsers];
                          if (e.target.checked) {
                            selected.push(user._id);
                          } else {
                            const index = selected.indexOf(user._id);
                            if (index > -1) {
                              selected.splice(index, 1);
                            }
                          }
                          setSelectedUsers(selected);
                        }}
                        className="mr-2"
                      />
                      {user.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCreateEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  作成
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </Modal>

        <EventDetailModal
          isOpen={isDetailModalOpen}
          event={selectedEvent}
          onRequestClose={() => setIsDetailModalOpen(false)}
          onDelete={handleDeleteEvent}
        />
      </div>
    </>
  );
};

export default MyCalendar;
