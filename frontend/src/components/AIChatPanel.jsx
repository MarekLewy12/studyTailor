import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
  FaChevronUp,
  FaPaperPlane,
  FaRegLightbulb,
  FaRobot,
  FaSpinner,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";

const AIChatPanel = ({ isOpen, onClose, subject }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

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

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/subject/${subject.id}/assistant/`,
        { question: userMessage.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Dodanie odpowiedzi AI do czatu
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.data.answer,
          timestamp: response.data.timestamp || new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Błąd podczas komunikacji z asystentem AI:", error);
      setError(
        "Nie udało się uzyskać odpowiedzi od asystenta. Spróbuj ponownie później.",
      );
    } finally {
      setIsLoading(false);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
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
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300"
              >
                <FaTimes size={20} />
              </button>
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
                        {message.text}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        {formatMessageTime(message.timestamp)}
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
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
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
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
