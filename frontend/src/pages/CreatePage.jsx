import React, { useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";
import ScheduleTable from "../components/ScheduleTable";
import { ClipLoader } from "react-spinners";

const CreatePage = () => {
  const [albumNumber, setAlbumNumber] = useState(""); // Stan dla numeru albumu
  const [schedule, setSchedule] = useState(null); // Stan dla harmonogramu
  const [loading, setLoading] = useState(false); // Stan dla ładowania
  const [error, setError] = useState(""); // Obsługa błędów

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegaj domyślnemu zachowaniu formularza (przeładowanie strony)
    setLoading(true); // Ustaw stan ładowania
    setError(""); // Wyczyść błąd
    setSchedule(null); // Wyczyść harmonogram

    try {
      const response = await axios.post("http://localhost:8000", {
        album_number: albumNumber,
      });

      let data = JSON.parse(response.data.response); // Przetworzenie danych

      // DEBUG: wyświetlenie danych w konsoli
      console.log("Przetworzone dane: ", data);

      // Sprawdzenie czy dane są tablicą
      if (Array.isArray(data)) {
        setSchedule(data);
      } else if (typeof data === "object") {
        // Jeśli dane są obiektem, to przekształć je w tablicę
        setSchedule([data]);
      } else {
        // Jeśli błąd z formatem danych
        console.error("Nieprawidłowy format danych: ", data);
        setSchedule([]);
      }
    } catch (error) {
      // Jeśli błąd z komunikacją z backendem
      console.error("Błąd podczas komunikacji z serwerem: ", error);
      setError("Nie udało się pobrać harmonogramu. Spróbuj ponownie.");
      setSchedule([]);
    } finally {
      setLoading(false); // Zakończ ładowanie (kończy animację ładowania)
    }
  };


  return (
      <div className="min-h-screen">
        <div className="container mx-auto py-10 px-4">
          <AnimatedSection>
            <h1 className="text-3xl pt-16 md:text-4xl font-bold text-orange-600 text-center mb-8">
              Tworzenie harmonogramu
            </h1>
          </AnimatedSection>

          {/* Formularz */}
          <AnimatedSection delay={0.4}>
            <form
                onSubmit={handleSubmit} // Obsługa submit
                className="space-y-6 bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto"
            >
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
                    value={albumNumber}
                    onChange={(e) => setAlbumNumber(e.target.value)} // Aktualizacja stanu
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                />
              </div>
              <div className="text-center">
                <button
                    type="submit"
                    className={`bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300
                    ${loading && "cursor-not-allowed opacity-70"}`}
                    disabled={loading} // Blokada przycisku podczas ładowania
                >
                  {loading ? (
                      <div className="flex items-center justify-center">
                        <ClipLoader size={20} color="#fff" />
                        <span className="ml-2">Generuję...</span>
                      </div>
                  ) : (
                      "Generuj harmonogram"
                  )}
                </button>
              </div>
            </form>
          </AnimatedSection>

          {/* Obsługa błędów */}
          {error && (
              <div className="mt-4 text-red-600 text-center font-semibold">
                {error}
              </div>
          )}

          {/* Wyświetlenie tabeli harmonogramu */}
          {schedule && (
              <React.Fragment>
                {console.log("Dane przekazane do ScheduleTable: ", schedule)}
              <AnimatedSection delay={0.6}>
                <ScheduleTable schedule={schedule} /> {/* Przekazanie danych */}
              </AnimatedSection>
              </React.Fragment>
          )}
        </div>
      </div>
  );
};

export default CreatePage;
