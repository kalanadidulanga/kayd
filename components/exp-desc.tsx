import React from "react";

const ExperienceDescription: React.FC<{
  paragraphs: string[];
  bullets: string[];
}> = ({ paragraphs, bullets }) => {
  return (
    <div>
      {paragraphs &&
        paragraphs.length > 0 &&
        paragraphs.map((paragraph, index) => (
          <p className="mb-4" key={index}>
            {paragraph}
          </p>
        ))}
      <ul className="list-disc pl-6 mt-4">
        {bullets &&
          bullets.length > 0 &&
          bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
      </ul>
    </div>
  );
};

export default ExperienceDescription;
