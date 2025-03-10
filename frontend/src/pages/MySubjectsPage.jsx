import React from "react";
import { Link } from "react-router-dom";

const MySubjectsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-10 px-4 max-w-md text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
          Moje przedmioty
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Nie masz jeszcze żadnych przedmiotów
          {/*TODO: wyświetlaj tutaj przedmioty użytkownika */}
        </p>
      </div>
    </div>
  );
};

export default MySubjectsPage;
