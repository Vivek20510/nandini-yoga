// src/components/TestimonialCard.jsx
const TestimonialCard = ({ name, text }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#d3b8ae]">
      <p className="italic text-[#7a5c5c]">“{text}”</p>
      <p className="mt-4 font-semibold text-[#6B4F4F]">— {name}</p>
    </div>
  );
  
  export default TestimonialCard;

  