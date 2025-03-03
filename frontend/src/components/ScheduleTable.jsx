import React from "react";

const ScheduleTable = ({ schedule }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Harmonogram nauki
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-orange-100 dark:bg-orange-900 text-gray-800 dark:text-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Przedmiot
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Forma zajęć
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Dzień nauki
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Godzina nauki
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Szczegóły
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Czas zajęć
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-100 dark:bg-gray-700"
                }
              >
                <td className="border border-gray-300 px-4 py-2">
                  {item.subject}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.lesson_form}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.study_day}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.study_time}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.details}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.class_time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
