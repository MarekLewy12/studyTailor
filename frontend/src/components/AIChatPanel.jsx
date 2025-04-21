import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  FaChevronUp,
  FaPaperPlane,
  FaRegLightbulb,
  FaRobot,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";
import ModelChangeConfirmPopup from "./ModelChangeConfirmPopup.jsx";

const AIChatPanel = ({ isOpen, onClose, subject }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek");
  const [previousModel, setPreviousModel] = useState(selectedModel);

  // zmiana modelu
  const [showModelChangeConfirm, setShowModelChangeConfirm] = useState(false);
  const [pendingModel, setPendingModel] = useState(null);

  const popupRef = useRef(null);

  // pasek postępu
  const [responseProgress, setResponseProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(20);
  const progressIntervalRef = useRef(null);
  const responseTimes = useRef([]); // Tablica do przechowywania czasów odpowiedzi

  const calculateAverageResponsetime = () => {
    if (responseTimes.current.length === 0) return 20;

    const recentTimes = responseTimes.current.slice(-5);
    const sum = recentTimes.reduce((acc, time) => acc + time, 0);
    const average = sum / recentTimes.length;

    return average + 2;
  };

  const simulateProgress = (estimatedTimeInSec) => {
    setResponseProgress(0);
    setEstimatedTime(estimatedTimeInSec);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const totalSteps = 100;
    const intervalDelay = (estimatedTimeInSec * 1000) / totalSteps; // opóźnienie w ms między aktualizacjami

    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      currentStep++;

      const progress = Math.min(
        98,
        Math.pow(currentStep / totalSteps, 0.7) * 98,
      );

      setResponseProgress(progress);

      if (currentStep >= totalSteps) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, intervalDelay);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowDeleteConfirm(false);
      }
    };

    if (showDeleteConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteConfirm]);

  // funkcje dotyczące zmiany modelu
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    if (newModel !== selectedModel && messages.length > 1) {
      // Wybrano nowy model -> popup + zmiana modelu w stanie
      setPendingModel(newModel);
      setShowModelChangeConfirm(true);
    } else {
      // Jeśli nie ma historii konwersacji, po prostu zmiana modelu
      setSelectedModel(newModel);
    }
  };

  const confirmModelChange = () => {
    // Użytkownik zgodził się zmienić model -> konwersacja jest czyszczona
    setSelectedModel(pendingModel);
    confirmAndDeleteConversation();
    setShowModelChangeConfirm(false);
    setPendingModel(null);
  };

  const cancelModelChange = () => {
    // Użytkownik anulował zmianę modelu -> powrót do poprzedniego modelu
    setShowModelChangeConfirm(false);
    setPendingModel(null);
  };

  const confirmAndDeleteConversation = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/subject/${subject.id}/chat-history/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([
        {
          sender: "ai",
          text: `Cześć! Jak mogę Ci pomóc z przedmiotem ${subject.name}?`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Błąd podczas usuwania konwersacji:", error);
      setError("Nie udało się usunąć historii czatu.");
    }
  };

  // Przewijanie czatu do najnowszej wiadomości
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Pobranie historii czatu z asystentem AI
    if (isOpen && subject?.id) {
      const fetchChatHistory = async () => {
        setIsHistoryLoading(true);
        setError("");

        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `/subject/${subject.id}/chat-history/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setMessages(response.data);
        } catch (error) {
          console.error("Błąd podczas pobierania historii czatu:", error);

          if (error.response?.status === 404) {
            setMessages([
              {
                sender: "ai",
                text: `Cześć! Jak mogę Ci pomóc z przedmiotem ${subject.name}?`,
                timestamp: new Date().toISOString(),
              },
            ]);
          } else {
            setError(
              "Nie udało się pobrać historii czatu. Spróbuj ponownie później.",
            );
          }
        } finally {
          setIsHistoryLoading(false);
          setTimeout(() => {
            scrollToBottom();
            inputRef.current?.focus();
          }, 100);
        }
      };
      fetchChatHistory();
    }
  }, [isOpen, subject?.id]);

  useEffect(() => {
    scrollToBottom();
    // odpowiednie renderowanie wzorów matematycznych
    if (window.renderMathInElement && messagesEndRef.current) {
      setTimeout(() => {
        const elements = document.querySelectorAll(".math-content");
        for (const el of elements) {
          window.renderMathInElement(el, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
            ],
          });
        }
      }, 100);
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    const avgTime = calculateAverageResponsetime();
    simulateProgress(avgTime);

    const starttime = performance.now(); // rozpoczęcie pomiaru czasu

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/subject/${subject.id}/assistant/`,
        { question: userMessage.text, model: selectedModel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Pobranie id zadania
      const taskId = response.data.task_id;
      const responseModel = response.data.model;

      const checkTaskStatus = async () => {
        try {
          const statusResponse = await axios.get(`/task/${taskId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (statusResponse.data.status === "completed") {
            clearInterval(progressIntervalRef.current);
            setResponseProgress(100);

            const result = statusResponse.data.result;

            // Dodanie odpowiedzi AI do czatu
            setMessages((prev) => [
              ...prev,
              {
                sender: "ai",
                text: result.answer,
                timestamp: result.timestamp || new Date().toISOString(),
                elapsed_time: result.elapsed_time,
                model: result.model || responseModel,
              },
            ]);
            setIsLoading(false);
          } else if (statusResponse.data.status === "failed") {
            clearInterval(progressIntervalRef.current);
            setResponseProgress(0);
            setIsLoading(false);
            setError("Wystąpił błąd podczas przetwarzania zapytania.");
          } else {
            // Kontynuuj sprawdzanie statusu co 2 sekundy
            setTimeout(checkTaskStatus, 2000);
          }
        } catch (error) {
          clearInterval(progressIntervalRef.current);
          setResponseProgress(0);
          setIsLoading(false);
          setError("Wystąpił błąd podczas sprawdzania statusu zadania.");
          console.error("Błąd podczas sprawdzania statusu zadania:", error);
        }
      };

      checkTaskStatus();

      const endTime = performance.now(); // zakończenie pomiaru czasu
      const actualResponseTime = (endTime - starttime) / 1000; // czas w sekundach

      responseTimes.current.push(actualResponseTime); // dodanie czasu odpowiedzi do tablicy
    } catch (error) {
      clearInterval(progressIntervalRef.current);
      setResponseProgress(0);

      console.error("Błąd podczas komunikacji z asystentem AI:", error);
      setError(
        "Nie udało się uzyskać odpowiedzi od asystenta. Spróbuj ponownie później.",
      );
    }
  };

  // Formatowanie daty wiadomości
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Generowanie wskazówek dla użytkownika
  const getSuggestions = () => {
    if (!subject) return [];

    const basicSuggestions = [
      "Jakie są podstawowe pojęcia związane z tym przedmiotem?",
      "Wyjaśnij podstawy teoretyczne tego przedmiotu",
      "Podaj przykłady praktycznego zastosowania wiedzy z tego przedmiotu",
    ];

    // Dodatkowe sugestie zależne od formy zajęć
    if (subject.lesson_form.toLowerCase() === "laboratorium") {
      return [
        ...basicSuggestions,
        "Jakie są typowe metody badawcze używane w tych laboratoriach?",
        "Czego mogę się spodziewać na tych zajęciach laboratoryjnych?",
      ];
    } else if (subject.lesson_form.toLowerCase() === "wykład") {
      return [
        ...basicSuggestions,
        "Jakie są główne obszary badań w tej dziedzinie?",
        "Wymień znanych naukowców, którzy przyczynili się do rozwoju tej dziedziny",
      ];
    }

    return basicSuggestions;
  };

  const clearConversation = () => {
    setMessages([
      {
        sender: "ai",
        text: `Cześć! Jak mogę Ci pomóc z przedmiotem ${subject.name}?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 250,
              mass: 0.8,
            }}
            className="fixed left-0 top-0 bottom-0 w-full sm:w-96 md:w-1/3 lg:w-1/2 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            {/* NAGŁÓWEK */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <FaRobot className="mr-2 text-xl" />
                <h2 className="text-xl font-bold">
                  {subject ? `Asystent: ${subject.name}` : "Asystent AI"}
                </h2>
              </div>
              <div className="flex items-center">
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  className="mr-3 bg-indigo-500 border-none rounded py-1 px-2 text-sm"
                >
                  <option value="deepseek">Deepseek</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* TREŚĆ CZATU */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 p-6 ${
                        message.sender === "user"
                          ? "bg-indigo-500 ml-2"
                          : "bg-purple-500"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <FaUserGraduate
                          size={16}
                          className="text-white flex-shrink-0"
                        />
                      ) : (
                        <FaRobot
                          size={20}
                          className="text-white flex-shrink-0"
                        />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                          : "bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap math-content">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {message.text}
                        </ReactMarkdown>
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        {formatMessageTime(message.timestamp)}
                        {message.sender === "ai" && (
                          <>
                            {message.elapsed_time && (
                              <span className="ml-2">
                                Czas odpowiedzi:{" "}
                                {message.elapsed_time.toFixed(2)}s
                              </span>
                            )}
                            {message.model && (
                              <span className="ml-2 bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                                {message.model === "deepseek"
                                  ? "Deepseek Chat"
                                  : "GPT-4o"}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-gradient-to-br from-purple-500 to-indigo-600">
                      <FaRobot className="text-white text-sm" />
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center space-x-2">
                      {/* Komunikat o ładowaniu */}
                      <FaSpinner className="animate-spin text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Asystent przetwarza Twoje zapytanie...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r">
                  {error}
                </div>
              )}

              {/* Element do przewijania na koniec czatu */}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex justify-end mr-4 mb-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm((prev) => !prev)}
                  className="flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-700/50 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition"
                  title="Usuń konwersację"
                >
                  <FaTrash className="mr-1" />
                  Usuń
                </button>

                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute bottom-full mb-2 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-4 w-64"
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-100 mb-3">
                        Czy na pewno chcesz usunąć konwersację? Tej operacji nie
                        da się cofnąć.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          Anuluj
                        </button>
                        <button
                          onClick={confirmAndDeleteConversation}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Usuń
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SUGESTIE PYTAŃ */}
            {messages.length <= 2 && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20">
                <div className="flex items-center mb-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  <FaRegLightbulb className="mr-1" />
                  <span>Przykładowe pytania:</span>
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="ml-auto text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 p-1 rounded transition-colors"
                    title={
                      showSuggestions ? "Ukryj sugestie" : "Pokaż sugestie"
                    }
                  >
                    <FaChevronUp
                      size={18}
                      className={`transform transition-transform duration-300 ${
                        showSuggestions ? "" : "rotate-180"
                      }`}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "hidden",
                      }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mt-2"
                    >
                      <div className="grid grid-cols-1 gap-2">
                        {getSuggestions().map((suggestion, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.2 }}
                            className="text-left text-xs p-2 bg-white dark:bg-gray-700 rounded border border-indigo-200 dark:border-indigo-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
                            onClick={() => {
                              setInput(suggestion);
                              inputRef.current?.focus();
                            }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* FORMULARZ WIADOMOŚCI */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <form
                onSubmit={handleSubmit}
                className="flex items-end space-x-2"
              >
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Wpisz swoje pytanie..."
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Naciśnij Enter, aby wysłać. Shift+Enter dla nowej linii.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-lg ${
                    !input.trim() || isLoading
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  } transition-colors duration-300`}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
          <ModelChangeConfirmPopup
            isOpen={showModelChangeConfirm}
            onCancel={cancelModelChange}
            onConfirm={confirmModelChange}
            currentModel={selectedModel}
            newModel={pendingModel}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
