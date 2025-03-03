import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import plLocale from "@fullcalendar/core/locales/pl";
import interactionPlugin from "@fullcalendar/interaction";

const ScheduleCalendar = ({ schedule }) => {
  const events = schedule.map((item) => {
    const [startHour, startMinute] = item.study_time
      .split(" - ")[0]
      .split(":")
      .map(Number);
    const [endHour, endMinute] = item.study_time
      .split(" - ")[1]
      .split(":")
      .map(Number);

    const eventDate = new Date(item.study_day);
    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMinute);

    const endDate = new Date(eventDate);
    endDate.setHours(endHour, endMinute);

    return {
      title: item.subject,
      start: startDate,
      end: endDate,
      backgroundColor: getSubjectColor(item.subject),
      borderColor: getSubjectColor(item.subject),
      textColor: "#ffffff",
      extendedProps: {
        lessonForm: item.lesson_form,
        details: item.details,
        classTime: item.class_time,
      },
    };
  });

  function getSubjectColor(subject) {
    const colors = [
      "#f97316", // orange-500
      "#f59e0b", // amber-500
      "#84cc16", // lime-500
      "#06b6d4", // cyan-500
      "#8b5cf6", // violet-500
    ];

    const hash = subject.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-xl p-6 transition-colors duration-300">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={plLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        events={events}
        eventContent={(eventInfo) => (
          <div
            className="p-2 h-full w-full cursor-pointer"
            title={`${eventInfo.event.extendedProps.lessonForm}\n${eventInfo.event.extendedProps.details}\nZajęcia: ${eventInfo.event.extendedProps.classTime}`}
          >
            <div className="font-semibold text-sm">{eventInfo.event.title}</div>
          </div>
        )}
        height={800}
        contentHeight={750}
        aspectRatio={1.8}
        allDaySlot={false}
        slotDuration="01:00:00"
        expandRows={true}
        stickyHeaderDates={true}
        nowIndicator={true}
        weekNumbers={true}
        weekNumberFormat={{ week: "numeric" }}
        dayHeaderFormat={{ weekday: "long", day: "numeric", month: "long" }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
      />
    </div>
  );
};

export default ScheduleCalendar;
