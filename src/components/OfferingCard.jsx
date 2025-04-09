// src/components/OfferingCard.jsx
const OfferingCard = ({ title, desc, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#6B4F4F]">{title}</h3>
      <p className="mt-2 text-[#7a5c5c]">{desc}</p>
    </div>
  );
  
  export default OfferingCard;
  