import React from "react";
import { FaRegCalendarCheck, FaChartLine, FaSmileBeam } from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaRegCalendarCheck size={30} className="text-orange-500" />,
      title: "Automatyzacja harmonogramów",
      description:
        "Ustaw harmonogramy automatycznie dzięki sztucznej inteligencji i zaoszczędź czas.",
    },
    {
      icon: <FaChartLine size={30} className="text-orange-500" />,
      title: "Śledzenie postępów",
      description:
        "Monitoruj swoje osiągnięcia i zadania, aby być zawsze na bieżąco.",
    },
    {
      icon: <FaSmileBeam size={30} className="text-orange-500" />,
      title: "Przyjazny interfejs",
      description:
        "Intuicyjny projekt, który sprawia, że korzystanie z aplikacji jest łatwe i przyjemne.",
    },
  ];

  return (
    <div className="py-10 px-4 text-center">
      <h2 className="text-3xl mt-12 md:text-4xl font-bold mb-6 text-orange-500">
        Poznaj funkcje naszej aplikacji
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Zautomatyzuj swoje harmonogramy nauki, śledź swoje postępy i osiągaj
        więcej każdego dnia.
      </p>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white w-[90%] mx-auto shadow-md rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 border-t-4 border-orange-500"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
