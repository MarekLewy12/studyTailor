function Card({ icon, title, desc }) {
  return (
    <div className="bg-none border-2 border-purple-600 rounded-lg flex flex-col items-center shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 h-full">
      {icon}
      <h3 className="text-2xl font-semibold mb-2 mt-6 text-purple-300">
        {title}
      </h3>
      <p className="text-white mt-auto text-xl text-center">{desc}</p>
    </div>
  );
}

export default Card;
