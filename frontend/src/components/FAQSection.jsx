import React from "react";

const FAQSection = () => {
  const faqs = [
    {
      question: "W jaki sposób założyć konto?",
      answer:
        "Aby założyć konto, wystarczy kliknąć przycisk 'Załóż konto' w prawym górnym rogu (bądź na środku) strony. Następnie należy wypełnić formularz rejestracyjny i potwierdzić adres e-mail.",
    },
    {
      question: "Czy aplikacja jest darmowa?",
      answer:
        "Tak, aplikacja jest całkowicie darmowa i dostępna dla każdego studenta ZUT.",
    },
    {
      question: "Jakie są korzyści z korzystania z aplikacji?",
      answer:
        "Korzystanie z aplikacji pozwala na zautomatyzowanie tworzenia harmonogramów zajęć przez co w ciągu kilku sekund uzyskasz jasny i zrozumiały plan działania",
    },
  ];

  return (
    <div className="py-10 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-500">
        FAQ
      </h2>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <div className="border-2 border-amber-500 p-3 rounded-2xl flex items-center justify-center hover:bg-amber-100 transition duration-200">
              <h3 className="text-lg font-semibold text-black">
                {faq.question}
              </h3>
            </div>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
