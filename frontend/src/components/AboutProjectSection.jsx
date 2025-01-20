import React from "react";

const AboutProjectSection = () => {
  return (
    <div className="py-10 px-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-500 text-center">
        O projekcie
      </h2>
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-700 mb-4">
          Nasz projekt ma na celu stworzenie aplikacji, która ułatwi studentom
          planowanie nauki i zarządzanie czasem. Pracujemy nad tym projektem w
          ramach przedmiotu "Inżynierski Projekt Zespołowy".
        </p>
        <p className="text-gray-700 mb-4">
          Zespół składa się z kilku studentów, którzy współpracują, aby
          dostarczyć funkcjonalne i użyteczne rozwiązanie, które sprawi że życie
          studentów (czyli również nas!) będzie prostsze.
        </p>
        <p className="text-gray-700 mb-4">
          W projekcie wykorzystujemy technologie, takie jak React, Python Django
          oraz SQLite, aby zapewnić wysoką jakość, wydajność i skalowalność
          aplikacji. Naszym celem jest stworzenie narzędzia, które będzie nie
          tylko funkcjonalne, ale także intuicyjne i przyjazne dla studentów{" "}
        </p>
        <p className="text-gray-700">
          W przyszłości planujemy żeby aplikacja działała dla różnych systemów
          pobierania planu zajęć, również tych ze szkół średnich.
        </p>
      </div>
    </div>
  );
};

export default AboutProjectSection;
