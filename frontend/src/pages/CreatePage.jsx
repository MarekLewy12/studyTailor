import React from "react";
import AnimatedSection from "../components/AnimatedSection";

const CreatePage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-4">
        {/* Nagłówek */}
        <AnimatedSection>
          <h1 className="text-3xl pt-16 md:text-4xl font-bold text-orange-600 text-center mb-8">
            Tworzenie harmonogramu
          </h1>
        </AnimatedSection>

        {/* Instrukcje */}
        <AnimatedSection delay={0.2}>
          <div className="text-gray-800 text-center text-lg md:text-xl mb-8">
            <p className="mb-4">
              Aby stworzyć harmonogram, wprowadź swój numer albumu w poniższym
              formularzu. <br/><br/>Po wypełnieniu formularza otrzymasz dostęp do
              spersonalizowanego harmonogramu, który pomoże Ci lepiej i efektywniej rozłożyć czas na naukę.
            </p>
            <ul className="list-disc list-inside text-orange-700">
              <li>Upewnij się, że numer albumu jest poprawny.</li>
              <li>
                Odpowiadaj na pytania co do swoich preferencji.
              </li>
            </ul>
          </div>
        </AnimatedSection>

        {/* Formularz */}
        <AnimatedSection delay={0.4}>
          <form className="space-y-6 bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto">
            <div>
              <label
                htmlFor="albumNumber"
                className="block text-gray-700 font-medium mb-2"
              >
                Numer albumu
              </label>
              <input
                id="albumNumber"
                type="text"
                placeholder="Wprowadź numer albumu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Rozpocznij
              </button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CreatePage;
