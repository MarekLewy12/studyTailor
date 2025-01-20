import React from "react";
import ScheduleCalendar from "./ScheduleCalendar";

const MockSchedule = () => {
  // Funkcja pomocnicza do generowania dat
  const getDateString = (daysToAdd = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  };

  const mockSchedule = [
    {
      subject: "Zarządzanie informacją 2",
      lesson_form: "Przygotowanie do laboratoriów",
      study_day: getDateString(0),
      study_time: "10:00 - 11:30",
      details: "Przygotowanie prezentacji na temat systemów CMS",
      class_time: "14:15 - 15:45",
    },
    {
      subject: "Sieci komputerowe",
      lesson_form: "Przygotowanie do egzaminu",
      study_day: getDateString(0),
      study_time: "14:00 - 16:00",
      details: "Konfiguracja routera i protokoły sieciowe",
      class_time: "8:15 - 9:45",
    },
    {
      subject: "Inżynierski projekt zespołowy",
      lesson_form: "Praca nad projektem",
      study_day: getDateString(1),
      study_time: "09:00 - 11:00",
      details: "Implementacja interfejsu użytkownika",
      class_time: "12:15 - 13:45",
    },
    {
      subject: "Podstawy ochrony informacji",
      lesson_form: "Nauka do kolokwium",
      study_day: getDateString(2),
      study_time: "16:00 - 18:00",
      details: "Kryptografia symetryczna i asymetryczna",
      class_time: "10:15 - 11:45",
    },
    {
      subject: "Sztuczna inteligencja",
      lesson_form: "Ćwiczenia praktyczne",
      study_day: getDateString(3),
      study_time: "13:00 - 15:00",
      details: "Implementacja algorytmu MinMax",
      class_time: "15:15 - 16:45",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-orange-600">
          Przykładowy harmonogram
        </h2>
        <p className="text-gray-600 mt-2">
          Zobacz, jak wygląda wygenerowany plan nauki
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <ScheduleCalendar schedule={mockSchedule} />
      </div>
    </div>
  );
};

export default MockSchedule;
