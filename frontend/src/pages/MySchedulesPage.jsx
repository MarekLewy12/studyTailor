import React from "react";
import { Link } from "react-router-dom";

const MySchedulesPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-10 px-4 max-w-md text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
          Moje harmonogramy
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Nie masz jeszcze żadnych harmonogramów.
          {/*TODO: wyświetlaj tutaj utworzone harmonogramy */}
        </p>
        <Link
          to="/create"
          className="
            inline-block
            text-lg
            px-3
            py-1
            rounded-full
            bg-gradient-to-r
            from-orange-400
            to-orange-600
            transition
            duration-300
            shadow-md
            hover:shadow-lg
            transform
            hover:scale-110
          "
        >
          Utwórz harmonogram
        </Link>
      </div>
    </div>
  );
};

export default MySchedulesPage;
