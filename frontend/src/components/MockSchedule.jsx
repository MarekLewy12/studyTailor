import React from "react";
import ScheduleTable from "./ScheduleTable";

const MockSchedule = () => {
  const mockSchedule = [
    {
      subject: "Zarządzanie informacją 2",
      lesson_form: "przygotowanie do laboratoriów",
      study_day: "2024-12-02",
      study_time: "20:00 - 21:30",
      details: "Brak szczegółów",
      class_time: "2024-12-03 10:30 - 12:00",
    },
    {
      subject: "Sieci komputerowe",
      lesson_form: "przygotowanie do laboratoriów",
      study_day: "2024-12-02",
      study_time: "21:30 - 22:30",
      details: "Brak szczegółów",
      class_time: "2024-12-03 14:15 - 16:00",
    },
    {
      subject: "Inżynierski projekt zespołowy 1",
      lesson_form: "przygotowanie do projektu",
      study_day: "2024-12-03",
      study_time: "08:00 - 09:30",
      details: "Brak szczegółów",
      class_time: "2024-12-04 08:30 - 11:30",
    },
    {
      subject: "Podstawy ochrony informacji",
      lesson_form: "przygotowanie do laboratoriów",
      study_day: "2024-12-04",
      study_time: "09:00 - 10:30",
      details: "Brak szczegółów",
      class_time: "2024-12-05 10:15 - 12:00",
    },
    {
      subject: "Sztuczna inteligencja",
      lesson_form: "nauka wybranych tematów",
      study_day: "2024-12-04",
      study_time: "18:00 - 20:00",
      details: "Tematy do nauki: minmax, bayes",
      class_time: "Brak zajęć",
    },
  ];

  return (
    <React.Fragment>
      <h2 className="text-center mt-6 text-3xl">
        Tak wygląda przykładowy harmonogram
      </h2>
      <ScheduleTable schedule={mockSchedule} />
    </React.Fragment>
  );
};

export default MockSchedule;
